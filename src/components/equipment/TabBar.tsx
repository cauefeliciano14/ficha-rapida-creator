import React from 'react';

interface TabBarProps {
  tabs: { id: string; label: string; badge?: number; badgeTitle?: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabChange }) => (
  <div style={{
    display: 'flex',
    gap: '0',
    borderBottom: '2px solid rgba(255,255,255,0.06)',
    marginBottom: '20px',
  }}>
    {tabs.map(tab => {
      const active = tab.id === activeTab;
      return (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            padding: '12px 24px',
            background: 'transparent',
            border: 'none',
            borderBottom: active ? '2px solid #f97316' : '2px solid transparent',
            marginBottom: '-2px',
            color: active ? '#f1f5f9' : '#64748b',
            fontWeight: active ? 700 : 500,
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {tab.label}
          {tab.badge ? (
            <span
              title={tab.badgeTitle}
              aria-label={tab.badgeTitle}
              style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: '#c53131', color: '#fff', fontSize: '0.7rem', fontWeight: 700, lineHeight: 1, verticalAlign: 'middle' }}
            >
              {tab.badge}
            </span>
          ) : null}
        </button>
      );
    })}
  </div>
);
