import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from './api.js';

const NAV = [
  ['browse', 'Explore events', '◈'],
  ['registrations', 'My registrations', '▣'],
  ['organizer', 'Organizer studio', '✳'],
  ['reports', 'Reports & insights', '⌁'],
  ['api', 'API explorer', '⌘'],
];

const ROUTES = [
  ['GET', '/api/events', 'Browse campus events'],
  ['GET', '/api/events/{id}', 'View one event'],
  ['POST', '/api/registrations', 'Register a profile for an event'],
  ['GET', '/api/me/registrations', 'List a profile’s registrations'],
  ['GET', '/api/events/{id}/registrations', 'View event attendees'],
];

function Icon({ children, className = '' }) {
  return <span aria-hidden="true" className={`icon ${className}`}>{children}</span>;
}

function StatusPill({ status }) {
  const value = String(status || 'unknown');
  return <span className={`status-pill ${value.toLowerCase() === 'open' ? 'is-open' : ''}`}><i />{value}</span>;
}

function App() {
  const [page, setPage] = useState('browse');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventError, setEventError] = useState('');
  const [apiOnline, setApiOnline] = useState(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userId, setUserId] = useState(() => localStorage.getItem('campuspulse-user-id') || '');
  const [profileDraft, setProfileDraft] = useState('');
  const [activeEvent, setActiveEvent] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');
  const [eventDetailLoading, setEventDetailLoading] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [rosterEvent, setRosterEvent] = useState(null);
  const [roster, setRoster] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [rosterError, setRosterError] = useState('');

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setEventError('');
    try {
      const data = await api.events();
      setEvents(Array.isArray(data) ? data : []);
      setApiOnline(true);
    } catch (error) {
      setEvents([]);
      setApiOnline(!error.message.startsWith('Could not reach the backend'));
      setEventError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
    api.health().then(() => setApiOnline(true)).catch(() => setApiOnline(false));
  }, [loadEvents]);

  const openEvents = useMemo(
    () => events.filter((event) => String(event.status || '').toLowerCase() === 'open').length,
    [events],
  );
  const filteredEvents = useMemo(() => events.filter((event) => {
    const matchesSearch = `${event.title || ''} ${event.id || ''} ${event.organizer_id || ''}`
      .toLowerCase().includes(query.trim().toLowerCase());
    const matchesStatus = statusFilter === 'all' || String(event.status).toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  }), [events, query, statusFilter]);

  const loadRegistrations = useCallback(async () => {
    if (!userId) {
      setRegistrations([]);
      setRegistrationError('Add a user UUID to load registrations for that profile.');
      return;
    }
    setRegistrationsLoading(true);
    setRegistrationError('');
    try {
      const data = await api.registrations(userId);
      setRegistrations(Array.isArray(data) ? data : []);
    } catch (error) {
      setRegistrationError(error.message);
      setRegistrations([]);
    } finally {
      setRegistrationsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (page === 'registrations') loadRegistrations();
  }, [page, loadRegistrations]);

  function saveProfile(event) {
    event.preventDefault();
    const next = profileDraft.trim();
    if (!next) return;
    localStorage.setItem('campuspulse-user-id', next);
    setUserId(next);
    setProfileDraft('');
    setRegistrationMessage('Profile UUID saved on this device.');
  }

  async function submitRegistration(event) {
    event.preventDefault();
    if (!userId) {
      setRegistrationMessage('Save your user UUID below before registering.');
      return;
    }
    setRegistering(true);
    setRegistrationMessage('');
    try {
      await api.register(userId, activeEvent.id);
      setRegistrationMessage('Registration created. You’re on the list.');
      setActiveEvent(null);
      if (page === 'registrations') loadRegistrations();
    } catch (error) {
      setRegistrationMessage(error.message);
    } finally {
      setRegistering(false);
    }
  }

  async function inspectEvent(event) {
    setActiveEvent(event);
    setRegistrationMessage('');
    setEventDetailLoading(true);
    try {
      setActiveEvent(await api.event(event.id));
    } catch (error) {
      setRegistrationMessage(error.message);
    } finally {
      setEventDetailLoading(false);
    }
  }

  async function showRoster(event) {
    setRosterEvent(event);
    setRoster([]);
    setRosterError('');
    setRosterLoading(true);
    try {
      const data = await api.attendees(event.id);
      setRoster(Array.isArray(data) ? data : []);
    } catch (error) {
      setRosterError(error.message);
    } finally {
      setRosterLoading(false);
    }
  }

  const pageTitle = NAV.find(([key]) => key === page)?.[1] || NAV[0][1];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#browse" onClick={() => setPage('browse')}>
          <span className="brand-mark"><span>✳</span></span>
          <span className="brand-copy"><strong>campus<span>pulse</span></strong><small>EVENT NETWORK <b>·</b> 01</small></span>
        </a>
        <div className="workspace-label">YOUR CAMPUS <span>⌄</span></div>
        <div className="campus-card"><span className="campus-logo">N</span><span><b>Northstar University</b><small>Community network</small></span><span className="more">···</span></div>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {NAV.map(([key, label, glyph]) => (
            <button key={key} className={`nav-link ${page === key ? 'active' : ''}`} onClick={() => setPage(key)}>
              <Icon>{glyph}</Icon><span>{label}</span>{key === 'registrations' && registrations.length > 0 && <small className="nav-count">{registrations.length}</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="endpoint-card">
          <div className="endpoint-head"><span className="pulse-dot" /> BACKEND CONNECTION <span className="endpoint-menu">···</span></div>
          <div className="endpoint-url">{api.baseUrl.replace('https://', '')}</div>
          <div className="connection-state"><span className={`connection-light ${apiOnline === false ? 'offline' : ''}`} />{apiOnline === false ? 'UNREACHABLE' : apiOnline === null ? 'CONNECTING' : 'API RESPONDS'}</div>
        </div>
        <div className="user-chip"><span className="avatar">{userId ? 'U' : 'G'}</span><span><b>{userId ? 'Local profile' : 'Guest session'}</b><small>{userId ? `${userId.slice(0, 8)}…` : 'No sign-in required'}</small></span><button aria-label="Set profile UUID" onClick={() => { setPage('registrations'); setProfileDraft(userId); }}>⚙</button></div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div className="breadcrumbs"><span>CampusPulse</span><b>/</b><strong>{pageTitle}</strong></div>
          <div className="topbar-right"><span className="environment-badge"><i /> PUBLIC API</span><button className="icon-button" title="Refresh data" onClick={loadEvents}>⟳</button><span className="top-avatar">{userId ? 'U' : 'G'}</span></div>
        </header>
        <main className="content">
          {page === 'browse' && <BrowsePage events={filteredEvents} allEvents={events} loading={loading} error={eventError} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} openEvents={openEvents} onRefresh={loadEvents} onSelect={inspectEvent} onRoster={showRoster} />}
          {page === 'registrations' && <RegistrationsPage userId={userId} profileDraft={profileDraft} setProfileDraft={setProfileDraft} onSave={saveProfile} message={registrationMessage} items={registrations} loading={registrationsLoading} error={registrationError} onRefresh={loadRegistrations} onBrowse={() => setPage('browse')} />}
          {page === 'organizer' && <OrganizerPage events={events} loading={loading} error={eventError} onRoster={showRoster} onBrowse={() => setPage('browse')} />}
          {page === 'reports' && <ReportsPage events={events} loading={loading} error={eventError} openEvents={openEvents} onRefresh={loadEvents} />}
          {page === 'api' && <ApiPage online={apiOnline} />}
          <footer className="page-footer"><span>© 2026 CampusPulse</span><span>BUILT FOR THE IN-BETWEEN <b>✳</b></span><span><i className={`footer-dot ${apiOnline === false ? 'offline' : ''}`} />{apiOnline === false ? 'Backend unavailable' : 'Connected to public API'}</span></footer>
        </main>
      </div>

      {activeEvent && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveEvent(null); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="register-title"><button className="modal-close" onClick={() => setActiveEvent(null)} aria-label="Close">×</button><span className="eyebrow">EVENT REGISTRATION <span>POST</span></span><h2 id="register-title">You’re almost <em>there.</em></h2><p className="modal-event-title">{activeEvent.title || 'Campus event'}</p>{eventDetailLoading ? <div className="loading-line"><span className="spinner" /> Loading event details…</div> : <><div className="detail-facts"><span><small>STATUS</small><StatusPill status={activeEvent.status} /></span><span><small>CAPACITY</small><b>{activeEvent.capacity ?? 'Not specified'}</b></span><span><small>ORGANIZER</small><code>{activeEvent.organizer_id || '—'}</code></span></div><p className="muted">This app has no login. The backend requires a UUID from the <code>users</code> table to create a registration.</p><div className="profile-summary"><span className="avatar">{userId ? 'U' : '?'}</span><span><b>{userId || 'No profile UUID saved'}</b><small>Stored only in this browser</small></span><button onClick={() => { setActiveEvent(null); setPage('registrations'); setProfileDraft(userId); }}>Change</button></div>{registrationMessage && <div className={`notice ${registrationMessage.includes('created') ? 'success' : ''}`}>{registrationMessage}</div>}<form onSubmit={submitRegistration}><button className="button primary full" disabled={registering || !userId}>{registering ? 'Sending registration…' : 'Confirm registration'} <span>↗</span></button></form></>}<p className="modal-footnote">Your request goes directly to the CampusPulse API.</p></section></div>}
      {rosterEvent && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setRosterEvent(null); }}><section className="modal-card roster-modal" role="dialog" aria-modal="true" aria-labelledby="roster-title"><button className="modal-close" onClick={() => setRosterEvent(null)} aria-label="Close">×</button><span className="eyebrow">ATTENDEE ROSTER <span>GET</span></span><h2 id="roster-title">People going<span className="title-period">.</span></h2><p className="modal-event-title">{rosterEvent.title || rosterEvent.id}</p>{rosterLoading ? <div className="loading-line"><span className="spinner" /> Loading attendee list…</div> : rosterError ? <div className="notice error">{rosterError}</div> : roster.length === 0 ? <div className="empty-state compact"><span>◎</span><b>No registrations yet</b><small>Attendees will appear here once registered.</small></div> : <div className="roster-list">{roster.map((entry) => <div className="roster-row" key={entry.id}><span className="avatar">{(entry.user_id || '?').slice(0, 1).toUpperCase()}</span><span><b>Campus member</b><small className="mono">{entry.user_id}</small></span><span className="roster-check">✓</span></div>)}</div>}<button className="button secondary full" onClick={() => setRosterEvent(null)}>Done <span>↗</span></button></section></div>}
    </div>
  );
}

function PageHeading({ eyebrow, title, accent, description, actions }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title} <em>{accent}</em></h1><p>{description}</p></div>{actions && <div className="heading-actions">{actions}</div>}</div>;
}

function BrowsePage({ events, allEvents, loading, error, query, setQuery, statusFilter, setStatusFilter, openEvents, onRefresh, onSelect, onRoster }) {
  const totalSeats = allEvents.reduce((sum, event) => sum + (Number(event.capacity) || 0), 0);
  return <>
    <PageHeading eyebrow="THE CAMPUS, IN MOTION" title="Find your" accent="next thing." description="A little curiosity goes a long way. Find your people, learn something new, or just show up." actions={<><button className="button secondary" onClick={onRefresh}>↻ <span>Refresh feed</span></button><span className="live-label"><i /> LIVE FEED</span></>} />
    <section className="hero-strip"><div className="hero-copy"><div className="hero-kicker"><span className="spark">✳</span> THIS IS YOUR CAMPUS</div><h2>Make the most of<br />your <em>in-between.</em></h2><p>Ideas, people, and plans worth leaving your room for.</p><button className="hero-link" onClick={() => document.getElementById('event-grid')?.scrollIntoView({ behavior: 'smooth' })}>Explore what’s happening <span>↘</span></button></div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-core">CP<span>✳</span></div><span className="orbit-tag tag-one">IDEAS IN MOTION</span><span className="orbit-tag tag-two">YOU BELONG HERE</span><span className="hero-sticker">SHOW<br />UP <b>↗</b></span></div><div className="hero-index">01 <span>/</span> 04</div></section>
    <section className="metric-row"><Metric label="EVENTS ON THE RADAR" value={loading ? '—' : String(allEvents.length).padStart(2, '0')} note="Across your campus" glyph="◈" /><Metric label="OPEN REGISTRATION" value={loading ? '—' : String(openEvents).padStart(2, '0')} note="Ready when you are" glyph="↗" tone="orange" /><Metric label="SEATS IN PLAY" value={loading ? '—' : totalSeats.toLocaleString()} note="Capacity across events" glyph="⊞" tone="cyan" /><div className="metric-connection"><span className="connection-pulse" /><span>DATA STREAM<br /><b>CONNECTED</b></span></div></section>
    <div className="section-heading" id="event-grid"><div><div className="eyebrow">YOUR NEXT CHAPTER</div><h2>Events worth showing up for <span className="title-period">.</span></h2></div><span className="mono section-count">{String(events.length).padStart(2, '0')} RESULTS</span></div>
    <div className="filter-bar"><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events, organizers, or IDs…" /><kbd>⌘ K</kbd></label><div className="filter-tabs">{['all', 'open', 'closed'].map((filter) => <button key={filter} className={statusFilter === filter ? 'selected' : ''} onClick={() => setStatusFilter(filter)}>{filter === 'all' ? 'All events' : filter[0].toUpperCase() + filter.slice(1)}</button>)}</div><button className="filter-icon" title="Refresh" onClick={onRefresh}>⟳</button></div>
    {loading ? <LoadingState label="Pulling the event stream" /> : error ? <ErrorState message={error} onRetry={onRefresh} /> : events.length === 0 ? <div className="empty-state"><span>✳</span><b>No events have landed yet</b><small>Try refreshing in a moment. Events from your backend will show up here.</small></div> : filteredEvents.length === 0 ? <div className="empty-state"><span>⌕</span><b>No matches found</b><small>Try another search or status filter.</small></div> : <div className="event-grid">{events.map((event, index) => <EventCard key={event.id} event={event} index={index} onSelect={() => onSelect(event)} onRoster={() => onRoster(event)} />)}</div>}
    <div className="api-note"><span className="api-note-icon">⌁</span><span><b>Direct from your backend</b><small>Event cards are loaded live from the public CampusPulse API.</small></span><code>GET /api/events</code></div>
  </>;
}

function EventCard({ event, index, onSelect, onRoster }) {
  const initials = (event.title || 'CP').split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
  const open = String(event.status || '').toLowerCase() === 'open';
  return <article className={`event-card card-${index % 4}`}><div className="event-cover"><span className="cover-no">CP / {String(index + 1).padStart(2, '0')}</span><span className="cover-glyph">{['✳', '◈', '⌁', '✣'][index % 4]}</span><span className="cover-orbit" /><span className="cover-cap">{event.capacity ? `${event.capacity} SEATS` : 'CAMPUS EVENT'}</span></div><div className="event-info"><div className="event-meta"><StatusPill status={event.status} /><span className="mono">EVENT / {String(event.id || '').slice(0, 8)}</span></div><h3>{event.title || 'Untitled campus event'}</h3><div className="event-facts"><span><i>◷</i> Schedule to be announced</span><span><i>⌖</i> Northstar campus</span></div><div className="organizer-line"><span className="organizer-avatar">{initials}</span><span><small>HOSTED BY</small><b className="mono">{String(event.organizer_id || 'Campus team').slice(0, 14)}</b></span><span className="card-capacity">{event.capacity ? `${event.capacity} max` : 'Open'}</span></div><div className="card-actions"><button className="button primary" onClick={onSelect} disabled={!open}> {open ? 'Save my seat' : 'Registration closed'} <span>↗</span></button><button className="button icon-only" title="View attendees" onClick={onRoster}>◎</button></div></div></article>;
}

function Metric({ label, value, note, glyph, tone = '' }) {
  return <div className={`metric ${tone}`}><div className="metric-top"><span>{label}</span><b>{glyph}</b></div><div className="metric-value">{value}<span>{tone === 'orange' ? ' OPEN' : ''}</span></div><div className="metric-note">{note}</div></div>;
}

function RegistrationsPage({ userId, profileDraft, setProfileDraft, onSave, message, items, loading, error, onRefresh, onBrowse }) {
  return <>
    <PageHeading eyebrow="YOUR PLACE IN THE ROOM" title="Plans worth" accent="keeping." description="Your campus calendar, with a little more possibility in it." actions={<button className="button secondary" onClick={onRefresh}>↻ <span>Sync tickets</span></button>} />
    <section className="profile-panel"><div className="profile-panel-mark">▣</div><div className="profile-panel-copy"><div className="eyebrow">LOCAL PROFILE · NO SIGN-IN</div><h2>{userId ? 'Your registrations are one tap away.' : 'Connect a profile UUID to see your tickets.'}</h2><p>The backend registration API looks up a user by UUID. This value stays in this browser only; there’s no account or login flow.</p></div><form className="profile-form" onSubmit={onSave}><label htmlFor="profile-id">USER UUID</label><div className="profile-input-row"><input id="profile-id" value={profileDraft} onChange={(event) => setProfileDraft(event.target.value)} placeholder="Paste a users.id UUID" /><button className="button primary" type="submit">{userId ? 'Update' : 'Save'} <span>↗</span></button></div>{message && <small className="inline-message">{message}</small>}</form></section>
    <div className="section-heading"><div><div className="eyebrow">YOUR LINEUP</div><h2>Registrations <span className="title-period">.</span></h2></div><span className="mono section-count">{String(items.length).padStart(2, '0')} TICKETS</span></div>
    {!userId ? <div className="empty-state"><span>▣</span><b>Nothing on your calendar yet</b><small>Save the UUID for a row in the backend’s <code>users</code> table above to load its registrations.</small><button className="button secondary" onClick={onBrowse}>Browse events <span>↗</span></button></div> : loading ? <LoadingState label="Finding your registrations" /> : error ? <ErrorState message={error} onRetry={onRefresh} /> : items.length === 0 ? <div className="empty-state"><span>▣</span><b>Your calendar is wide open</b><small>When you register for an event, your ticket will appear here.</small><button className="button primary" onClick={onBrowse}>Find an event <span>↗</span></button></div> : <div className="ticket-list">{items.map((item, index) => <article className="ticket" key={item.id || `${item.event_id}-${index}`}><div className={`ticket-symbol ticket-${index % 3}`}>✳</div><div className="ticket-body"><div className="eyebrow">CAMPUSPULSE · ENTRY {String(index + 1).padStart(3, '0')}</div><h3>{item.events?.title || 'Campus event'}</h3><p>{item.events?.status || 'Registration confirmed'} <span>·</span> {item.events?.capacity ? `${item.events.capacity} seats` : 'Campus network'}</p></div><div className="ticket-code"><span className="mono">REG / {String(item.id || item.event_id).slice(0, 8)}</span><div className="barcode">▥ ▥ ▥ ▥ ▥ ▥</div></div><StatusPill status="registered" /></article>)}</div>}
  </>;
}

function OrganizerPage({ events, loading, error, onRoster, onBrowse }) {
  return <>
    <PageHeading eyebrow="CLUBS & COMMUNITY" title="Bring your" accent="people together." description="A home base for the folks making campus happen." actions={<span className="live-label"><i /> PUBLIC WORKSPACE</span>} />
    <section className="organizer-banner"><div><span className="eyebrow">ORGANIZER STUDIO / 01</span><h2>Make something<br /><em>happen here.</em></h2><p>Every good campus story starts with someone putting an idea out there.</p></div><div className="banner-schematic"><span>EVENTS</span><i /><span>PEOPLE</span><i /><span>MOMENT</span><b>✳</b></div></section>
    <div className="section-heading"><div><div className="eyebrow">CAMPUS EVENT REGISTRY</div><h2>What’s coming up <span className="title-period">.</span></h2></div><span className="mono section-count">{String(events.length).padStart(2, '0')} RECORDS</span></div>
    <div className="schema-warning"><span>i</span><div><b>Event creation isn’t available in this backend yet</b><small>Listing events and viewing attendee lists work here. The API has no create-event route.</small></div><code>GET /api/events</code></div>
    {loading ? <LoadingState label="Loading event records" /> : error ? <ErrorState message={error} onRetry={onBrowse} /> : events.length === 0 ? <div className="empty-state"><span>✳</span><b>No event records to manage</b><small>When events appear through the backend, they’ll be listed here.</small></div> : <div className="data-table-wrap"><table className="data-table"><thead><tr><th>EVENT ENTITY</th><th>STATUS</th><th>CAPACITY</th><th>ORGANIZER UUID</th><th>ATTENDEES</th></tr></thead><tbody>{events.map((event) => <tr key={event.id}><td><b>{event.title || 'Untitled event'}</b><small className="mono">{event.id}</small></td><td><StatusPill status={event.status} /></td><td className="mono">{event.capacity ?? '—'}</td><td className="mono">{String(event.organizer_id || '—').slice(0, 12)}…</td><td><button className="text-button" onClick={() => onRoster(event)}>View roster ↗</button></td></tr>)}</tbody></table></div>}
    <div className="api-note"><span className="api-note-icon">⌁</span><span><b>Public API mode</b><small>Organizer-only access checks are disabled, as requested.</small></span><code>GET /api/events/:id/registrations</code></div>
  </>;
}

function ReportsPage({ events, loading, error, openEvents, onRefresh }) {
  const closed = Math.max(events.length - openEvents, 0);
  const seats = events.reduce((sum, event) => sum + (Number(event.capacity) || 0), 0);
  const openCapacity = events.filter((event) => String(event.status).toLowerCase() === 'open').reduce((sum, event) => sum + (Number(event.capacity) || 0), 0);
  return <>
    <PageHeading eyebrow="CAMPUS SIGNAL / ANALYTICS" title="See what’s" accent="taking shape." description="A live read on the events your campus is putting into motion." actions={<button className="button secondary" onClick={onRefresh}>↻ <span>Refresh metrics</span></button>} />
    {loading ? <LoadingState label="Gathering campus signals" /> : error ? <ErrorState message={error} onRetry={onRefresh} /> : <>
      <div className="report-metrics"><Metric label="TOTAL EVENTS" value={String(events.length).padStart(2, '0')} note="Event records in API" glyph="◈" /><Metric label="OPEN FOR SIGN-UP" value={String(openEvents).padStart(2, '0')} note="Accepting registrations" glyph="↗" tone="orange" /><Metric label="CLOSED / OTHER" value={String(closed).padStart(2, '0')} note="Not currently open" glyph="⊙" tone="cyan" /><Metric label="SEAT CAPACITY" value={seats.toLocaleString()} note="Across all listed events" glyph="⊞" /></div>
      <div className="report-grid"><section className="panel chart-panel"><div className="panel-head"><div><div className="eyebrow">REGISTRATION READINESS</div><h2>Open vs. other</h2></div><span className="mono">LIVE</span></div><div className="bar-chart"><div className="chart-labels"><span>Open <b>{openEvents}</b></span><span>Other <b>{closed}</b></span></div><div className="chart-track"><span style={{ width: `${events.length ? (openEvents / events.length) * 100 : 0}%` }} /></div><p>Current open-event capacity: <b>{openCapacity.toLocaleString()} seats</b></p></div></section><section className="panel signal-panel"><div className="eyebrow">DATA SOURCE</div><h2>One clear signal.</h2><p>Metrics are calculated from the event records returned by your deployed backend. Registration totals are not available as a public aggregate endpoint.</p><code>GET /api/events</code><div className="signal-status"><span className="connection-light" /> STREAMING FROM RENDER</div></section></div>
      <div className="schema-warning"><span>i</span><div><b>Attendee and registration totals need an aggregate route</b><small>The current API exposes per-user and per-event registrations, but no public campus-wide totals.</small></div></div>
    </>}
  </>;
}

function ApiPage({ online }) {
  return <>
    <PageHeading eyebrow="DEVELOPER CONSOLE / PUBLIC ACCESS" title="The API is" accent="the interface." description="Every visible event record and registration action goes through your Render backend." actions={<span className="live-label"><i /> NO LOGIN FLOW</span>} />
    <section className="api-hero"><div><span className="eyebrow">BASE URL</span><h2>{api.baseUrl}</h2><p>Requests are sent from this browser. The API currently permits cross-origin requests.</p></div><span className="api-hero-status"><i className={online === false ? 'offline' : ''} />{online === false ? 'OFFLINE' : 'LIVE'}</span></section>
    <div className="section-heading"><div><div className="eyebrow">ROUTE MAP / 05</div><h2>Available endpoints <span className="title-period">.</span></h2></div><span className="mono section-count">JSON / REST</span></div>
    <div className="route-list">{ROUTES.map(([method, path, description], index) => <div className="route-row" key={path}><span className={`method ${method.toLowerCase()}`}>{method}</span><code>{path}</code><span>{description}</span><small>{String(index + 1).padStart(2, '0')}</small></div>)}</div>
    <section className="panel connection-panel"><div className="panel-head"><div><div className="eyebrow">CONNECTION DIAGNOSTICS</div><h2>Live backend link</h2></div><span className={`connection-chip ${online === false ? 'failed' : ''}`}><i />{online === false ? 'UNREACHABLE' : online === null ? 'CHECKING' : 'REACHABLE'}</span></div><div className="diagnostic-grid"><div><small>BASE URL</small><code>{api.baseUrl}</code></div><div><small>HEALTH CHECK</small><code>GET /health</code></div><div><small>AUTHENTICATION</small><code>None · public access</code></div><div><small>CORS</small><code>Access-Control-Allow-Origin: *</code></div></div></section>
  </>;
}

function LoadingState({ label }) {
  return <div className="loading-state"><span className="spinner" /><b>{label}</b><small>Waiting for your campus backend</small></div>;
}

function ErrorState({ message, onRetry }) {
  return <div className="error-state"><span className="error-mark">!</span><div><b>The backend returned an error</b><p>{message}</p><small>The app reached your API; check the database permissions or try again.</small></div><button className="button secondary" onClick={onRetry}>Try again ↻</button></div>;
}

export default App;
