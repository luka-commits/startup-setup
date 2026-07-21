#!/usr/bin/env python3
"""mail-day — listet alle Mails eines Kalendertages (IN + OUT) aus dem Postfach, per IMAP.

Der Ersatzweg, wenn kein Mail-Connector verbunden ist (reference/mcp.md § Weg B).
Read-only (BODY.PEEK): nichts wird verschoben, gelöscht oder als gelesen markiert.

Zugangsdaten aus ~/.config/credentials.env (chmod 600, nie in Git):
  MAIL_IMAP_HOST=imap.example.com
  MAIL_IMAP_PORT=993            # optional, default 993
  MAIL_USER=du@deine-firma.de
  MAIL_PASS=app-passwort

Usage: python3 mail-day.py 2026-07-21 [--body N]   (N = Zeichen Body-Vorschau, default 0)
"""
import argparse, datetime, email, email.header, imaplib, os, re

CRED = os.path.expanduser("~/.config/credentials.env")


def creds():
    v = {}
    if os.path.exists(CRED):
        for line in open(CRED):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, val = line.split("=", 1)
                v[k.strip()] = val.strip().strip('"').strip("'")
    v.update({k: x for k, x in os.environ.items() if k.startswith("MAIL_")})
    return v


def dec(s):
    if not s:
        return ""
    return " ".join(t.decode(c or "utf-8", "ignore") if isinstance(t, bytes) else t
                    for t, c in email.header.decode_header(s))


def body_preview(msg, n):
    if not n:
        return ""
    txt = ""
    if msg.is_multipart():
        for p in msg.walk():
            if p.get_content_type() == "text/plain":
                try:
                    txt = p.get_payload(decode=True).decode(p.get_content_charset() or "utf-8", "ignore")
                    break
                except Exception:
                    pass
    else:
        try:
            txt = msg.get_payload(decode=True).decode(msg.get_content_charset() or "utf-8", "ignore")
        except Exception:
            pass
    return re.sub(r"\s+", " ", txt)[:n]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("date")
    ap.add_argument("--body", type=int, default=0)
    a = ap.parse_args()
    day = datetime.date.fromisoformat(a.date)
    nxt = day + datetime.timedelta(days=1)
    v = creds()
    if not (v.get("MAIL_IMAP_HOST") and v.get("MAIL_USER") and v.get("MAIL_PASS")):
        raise SystemExit("FEHLT: MAIL_IMAP_HOST / MAIL_USER / MAIL_PASS in ~/.config/credentials.env")
    M = imaplib.IMAP4_SSL(v["MAIL_IMAP_HOST"], int(v.get("MAIL_IMAP_PORT", "993")))
    M.login(v["MAIL_USER"], v["MAIL_PASS"])
    me = v["MAIL_USER"].lower()
    rows = []
    for folder in ("INBOX", "Sent", "Sent Items", "Archive"):
        try:
            typ, _ = M.select(folder, readonly=True)
            if typ != "OK":
                continue
        except Exception:
            continue
        typ, data = M.uid("search", None,
                          f'(SINCE "{day.strftime("%d-%b-%Y")}" BEFORE "{nxt.strftime("%d-%b-%Y")}")')
        if typ != "OK" or not data[0]:
            continue
        for uid in data[0].split():
            spec = "(BODY.PEEK[])" if a.body else "(BODY.PEEK[HEADER])"
            typ, md = M.uid("fetch", uid, spec)
            if typ != "OK" or not md or not md[0]:
                continue
            m = email.message_from_bytes(md[0][1])
            frm = dec(m.get("From"))
            to = dec(m.get("To"))[:60]
            direction = "OUT" if me in frm.lower() else "IN "
            hh = ""
            try:
                dt = email.utils.parsedate_to_datetime(m.get("Date"))
                hh = dt.strftime("%H:%M")
            except Exception:
                pass
            rows.append((hh, direction, frm[:46], to, dec(m.get("Subject"))[:78], body_preview(m, a.body)))
    M.logout()
    rows.sort()
    for hh, d, frm, to, subj, bp in rows:
        print(f"{hh} {d} | {frm} -> {to}")
        print(f"        SUBJ: {subj}")
        if bp:
            print(f"        BODY: {bp}")
    print(f"-- {len(rows)} Mails am {a.date}")


if __name__ == "__main__":
    main()
