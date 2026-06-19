export default function ManageTreks() {
  return (
    <div>
      <div className="admin-card">
        <h2>Manage Trek Page</h2>
        <p style={{ color: '#666', lineHeight: 1.7 }}>
          Trek destinations are automatically managed through the <strong>Destination Type</strong> setting in the Manage Destinations section.
        </p>
        <div style={{ background: '#e8f4fd', padding: 20, borderRadius: 8, marginTop: 15 }}>
          <h3 style={{ margin: '0 0 10px', color: '#1a3c5e' }}>How it works:</h3>
          <ul style={{ lineHeight: 2, color: '#444' }}>
            <li>When you set a destination's <strong>Destination Type</strong> to <strong>"Trek Destination"</strong>, it automatically appears on the <strong>Trek page</strong>.</li>
            <li>Normal destinations only show on the <strong>Destination Page</strong>.</li>
            <li>Trek destinations show on <strong>both</strong> the Destination Page AND the Trek Page.</li>
            <li>No duplicate database entries are created.</li>
          </ul>
        </div>
        <p style={{ marginTop: 20, color: '#888' }}>
          Go to <strong>Manage Destination Page</strong> in the sidebar to set destination types.
        </p>
      </div>
    </div>
  );
}
