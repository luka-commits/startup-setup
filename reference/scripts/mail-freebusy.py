#!/usr/bin/env python3
"""mail-freebusy — liest deinen Kalender aus den iCal-Invites im eigenen Postfach, per IMAP.

Der Ersatzweg, wenn kein Kalender-Connector verbunden ist (reference/mcp.md § Weg B).
Read-only. Zugangsdaten wie bei mail-day.py: MAIL_IMAP_HOST / MAIL_USER / MAIL_PASS
in ~/.config/credentials.env. Zeitzone via MAIL_TZ (default Europe/Berlin).

Kein OAuth, kein Google-MCP noetig: die meisten Termine kommen als iCal-Invite
(text/calendar) per Mail rein. Dieses Tool scannt INBOX nach VEVENTs, baut die
Busy-Bloecke und schlaegt freie Slots in den Geschaeftszeiten vor.

Damit kann ein Mail-Entwurf gleich konkrete freie Zeiten anbieten.

Usage:
  python3 mail-freebusy.py                      # JSON: busy + freie Slots, naechste 10 Werktage
  python3 mail-freebusy.py --days 10 --slot 30 --start 9 --end 18 --count 6
"""
import argparse, email, imaplib, json, os, re, sys
from datetime import datetime, timedelta, time, timezone

try:
    from zoneinfo import ZoneInfo
    LOCAL = ZoneInfo(os.environ.get("MAIL_TZ", "Europe/Berlin"))
except Exception:  # Fallback: feste MESZ-Naeherung
    LOCAL = timezone(timedelta(hours=2))

CRED = os.path.expanduser("~/.config/credentials.env")
WD_DE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]


def load_creds():
    vals = {}
    if os.path.exists(CRED):
        for line in open(CRED):
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            vals[k.strip()] = v.strip().strip('"').strip("'")
    vals.update({k: v for k, v in os.environ.items() if k.startswith("MAIL_")})
    return vals


def parse_ical_dt(val, params):
    """iCal DTSTART/DTEND -> lokale datetime. Handhabt Z (UTC), TZID, naiv, all-day."""
    val = val.strip()
    if re.match(r"^\d{8}$", val):  # all-day VALUE=DATE
        d = datetime.strptime(val, "%Y%m%d")
        return d.replace(tzinfo=LOCAL), True
    m = re.match(r"^(\d{8}T\d{6})(Z)?$", val)
    if not m:
        return None, False
    dt = datetime.strptime(m.group(1), "%Y%m%dT%H%M%S")
    if m.group(2) == "Z":
        dt = dt.replace(tzinfo=timezone.utc).astimezone(LOCAL)
    else:
        tzid = params.get("TZID")
        tz = LOCAL
        if tzid:
            try:
                tz = ZoneInfo(tzid)
            except Exception:
                tz = LOCAL
        dt = dt.replace(tzinfo=tz).astimezone(LOCAL)
    return dt, False


def unfold(text):
    # iCal-Zeilen-Fortsetzung: Folgezeile beginnt mit Space/Tab
    return re.sub(r"\r?\n[ \t]", "", text)


def extract_events(cal_text, win_start, win_end):
    cal_text = unfold(cal_text)
    busy = []
    for block in re.findall(r"BEGIN:VEVENT(.*?)END:VEVENT", cal_text, re.S):
        if re.search(r"^STATUS:CANCELLED", block, re.M) or re.search(r"^METHOD:CANCEL", block, re.M):
            continue
        fields = {}
        for line in block.split("\n"):
            line = line.strip()
            mm = re.match(r"^(DTSTART|DTEND|SUMMARY|RRULE)([^:]*):(.*)$", line)
            if not mm:
                continue
            key, raw_params, value = mm.group(1), mm.group(2), mm.group(3)
            params = dict(re.findall(r";([^=;]+)=([^;]+)", raw_params))
            fields[key] = (value, params)
        if "DTSTART" not in fields:
            continue
        start, allday = parse_ical_dt(*fields["DTSTART"])
        if start is None:
            continue
        if "DTEND" in fields:
            end, _ = parse_ical_dt(*fields["DTEND"])
        else:
            end = start + (timedelta(days=1) if allday else timedelta(minutes=30))
        if end is None or end <= start:
            end = start + timedelta(minutes=30)
        # nur Termine im Betrachtungsfenster
        if end <= win_start or start >= win_end:
            continue
        summary = fields.get("SUMMARY", ("", {}))[0][:60]
        # Teilnehmer-Adressen (fuer praezisen Thread↔Termin-Abgleich im brief-scan):
        # ATTENDEE/ORGANIZER-Zeilen tragen mailto:-Adressen.
        attendees = sorted({m.lower() for m in re.findall(r"(?:ATTENDEE|ORGANIZER)[^\n]*?mailto:([^\s\n;>]+)", block, re.I)})
        busy.append((start, end, summary, allday, attendees))
    return busy


def fetch_calendar_busy(win_start, win_end, lookback_days=75):
    c = load_creds()
    host, user, pw = c.get("MAIL_IMAP_HOST"), c.get("MAIL_USER"), c.get("MAIL_PASS")
    if not (host and user and pw):
        sys.exit("FEHLT: MAIL_IMAP_HOST / MAIL_USER / MAIL_PASS in ~/.config/credentials.env")
    port = int(c.get("MAIL_IMAP_PORT", "993"))
    imap = imaplib.IMAP4_SSL(host, port)
    imap.login(user, pw)
    busy = []
    try:
        imap.select("INBOX", readonly=True)
        since = (datetime.now(timezone.utc) - timedelta(days=lookback_days)).strftime("%d-%b-%Y")
        typ, data = imap.uid("search", None, f'(SINCE {since} HEADER Content-Type "text/calendar")')
        if typ != "OK" or not data or not data[0]:
            # Fallback: manche Server indexieren den Sub-Part nicht, dann breiter suchen
            typ, data = imap.uid("search", None, f'(SINCE {since} TEXT "BEGIN:VEVENT")')
        uids = data[0].split() if (data and data[0]) else []
        for i in range(0, len(uids), 100):
            chunk = b",".join(uids[i:i + 100])
            typ, resp = imap.uid("fetch", chunk, "(BODY.PEEK[])")
            if typ != "OK":
                continue
            for item in resp:
                if not (isinstance(item, tuple) and item[1]):
                    continue
                msg = email.message_from_bytes(item[1])
                for part in msg.walk():
                    if part.get_content_type() != "text/calendar":
                        continue
                    try:
                        payload = part.get_payload(decode=True)
                        cal = payload.decode(part.get_content_charset() or "utf-8", errors="replace")
                    except Exception:
                        continue
                    busy += extract_events(cal, win_start, win_end)
    finally:
        try:
            imap.logout()
        except Exception:
            pass
    # dedup + sortieren
    seen, uniq = set(), []
    for s, e, sm, ad, att in sorted(busy, key=lambda x: x[0]):
        key = (s.isoformat(), e.isoformat())
        if key in seen:
            continue
        seen.add(key)
        uniq.append((s, e, sm, ad, att))
    return uniq


def free_slots(busy, now, days, slot_min, start_h, end_h, count):
    """Ein Slot pro Tag, ueber mehrere Tage gestreut, zu buerofreundlichen Zeiten."""
    # bevorzugte Startzeiten (Vormittag spaet + Nachmittag zuerst, kein 09:00-sharp)
    pref = [h for h in [10, 11, 14, 15, 9, 16, 13, 17] if start_h <= h < end_h]
    slots = []
    day = now.date()
    checked = 0
    while len(slots) < count and checked < days + 8:
        checked += 1
        day += timedelta(days=1)
        if day.weekday() >= 5:  # Wochenende
            continue
        for h in pref:
            cur = datetime.combine(day, time(h), tzinfo=LOCAL)
            if cur <= now:
                continue
            slot_end = cur + timedelta(minutes=slot_min)
            if any(s < slot_end and cur < e for s, e, _, ad, _a in busy):
                continue
            slots.append(cur)
            break  # nur ein Vorschlag pro Tag, fuer Streuung ueber die Woche
    return slots[:count]


def fmt_slot(dt, slot_min):
    end = dt + timedelta(minutes=slot_min)
    return f"{WD_DE[dt.weekday()]} {dt.day:02d}.{dt.month:02d}., {dt.hour:02d}:{dt.minute:02d}-{end.hour:02d}:{end.minute:02d} Uhr"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=10)
    ap.add_argument("--slot", type=int, default=30)
    ap.add_argument("--start", type=int, default=9)
    ap.add_argument("--end", type=int, default=18)
    ap.add_argument("--count", type=int, default=6)
    ap.add_argument("--past", type=int, default=0, help="zusätzlich N Tage Vergangenheit (für Meeting-Resolution im Brief)")
    args = ap.parse_args()

    now = datetime.now(LOCAL)
    win_start = now - timedelta(days=args.past)
    win_end = now + timedelta(days=args.days + 4)
    busy = fetch_calendar_busy(win_start, win_end)
    slots = free_slots(busy, now, args.days, args.slot, args.start, args.end, args.count)

    print(json.dumps({
        "generated": now.isoformat(),
        "window": f"{win_start.date()} bis {win_end.date()}",
        "busy_count": len(busy),
        "busy": [{"start": s.isoformat(), "end": e.isoformat(), "summary": sm, "attendees": att} for s, e, sm, ad, att in busy],
        "free_slots": [fmt_slot(s, args.slot) for s in slots],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
