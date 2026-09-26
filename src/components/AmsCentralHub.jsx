import React, { useState } from 'react';
import { Sparkles, ArrowRight, UserCheck, Shield } from 'lucide-react';

export const AmsCentralHub = ({ onSelectModule, onOpenLoginModal, currentUser, isLanding = false }) => {
  const [hoveredNode, setHoveredNode] = useState(null);

  const modules = [
    { key: 'teknik', label: 'Teknik', desc: 'Konstruksi & Absen Kerja', color: '#f97316' },
    { key: 'legal', label: 'legal', desc: 'Legalitas, SPK & Perizinan', color: '#ea580c' },
    { key: 'marketing', label: 'Marketing', desc: 'Penjualan & Konsumen', color: '#0284c7' },
    { key: 'hr-ga', label: 'HR & GA', desc: 'SDM, Aset & Operasional', color: '#10b981' },
    { key: 'finance', label: 'Finance', desc: 'Keuangan, Arus Kas & Biaya', color: '#8b5cf6' },
    { key: 'todo-attendance', label: 'TO -DO LIST', desc: 'Agenda Harian & Presensi', color: '#f59e0b' }
  ];

  const getNodeStyle = (key, baseAlign = 'center') => {
    const isHovered = hoveredNode === key;
    return {
      background: isHovered ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
      border: isHovered ? '1.5px dashed rgba(234, 88, 12, 0.5)' : '1.5px solid transparent',
      borderRadius: '12px',
      padding: '8px 18px',
      fontSize: '1.45rem',
      fontWeight: 900,
      color: isHovered ? '#ea580c' : '#000000',
      cursor: 'pointer',
      textAlign: baseAlign,
      transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: baseAlign === 'right' ? 'flex-end' : (baseAlign === 'left' ? 'flex-start' : 'center'),
      userSelect: 'none',
      outline: 'none',
      position: 'relative'
    };
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: isLanding ? '100vh' : 'auto',
        background: '#ffffff',
        color: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isLanding ? '2.5rem 1rem' : '2.5rem 1rem',
        borderRadius: isLanding ? '0' : '20px',
        boxShadow: isLanding ? 'none' : '0 15px 40px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <style>
        {`
          .ams-hub-node-btn:hover {
            box-shadow: 0 4px 15px rgba(249, 115, 22, 0.15);
          }
          @media (max-width: 640px) {
            .ams-hub-circle-box {
              width: 210px !important;
              height: 210px !important;
            }
            .ams-hub-circle-text {
              font-size: 1.15rem !important;
            }
            .ams-hub-node-btn {
              font-size: 1.15rem !important;
              padding: 6px 10px !important;
            }
            .ams-hub-side-col {
              width: 110px !important;
              height: 210px !important;
            }
            .ams-hub-middle-row {
              gap: 10px !important;
            }
          }
        `}
      </style>

      {/* Top Banner Bar for Account Info / Switch User if provided */}
      {isLanding && onOpenLoginModal && (
        <div style={{ position: 'absolute', top: '16px', right: '20px', zIndex: 10 }}>
          <button
            type="button"
            onClick={onOpenLoginModal}
            style={{
              background: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#334155',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#0f172a';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.color = '#334155';
            }}
          >
            <UserCheck size={14} color="#ea580c" />
            <span>Pilih Akun Staf / Login Khusus</span>
          </button>
        </div>
      )}

      {/* MAIN DIAGRAM CONTAINER (EXACT 1-TO-1 WITH SKETCH) */}
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* 1. TOP ELEMENT: LOGO + AMS */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px',
            userSelect: 'none'
          }}
        >
          <img
            src="/company-logo.png"
            alt="AMS Logo"
            style={{
              width: '74px',
              height: '74px',
              objectFit: 'contain'
            }}
          />
          <div
            style={{
              fontSize: '1.35rem',
              fontWeight: 900,
              color: '#000000',
              marginTop: '6px',
              letterSpacing: '0.04em'
            }}
          >
            AMS
          </div>
        </div>

        {/* 2. MIDDLE ELEMENT: 3 COLUMNS (LEFT NODES, CENTER CIRCLE, RIGHT NODES) */}
        <div
          className="ams-hub-middle-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            gap: '24px'
          }}
        >
          {/* Left Column (Teknik & legal) */}
          <div
            className="ams-hub-side-col"
            style={{
              width: '170px',
              height: '270px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'flex-end'
            }}
          >
            {/* Node: Teknik */}
            <button
              type="button"
              className="ams-hub-node-btn"
              onClick={() => onSelectModule('teknik')}
              onMouseEnter={() => setHoveredNode('teknik')}
              onMouseLeave={() => setHoveredNode(null)}
              style={getNodeStyle('teknik', 'right')}
              title="Buka Modul Teknik & Konstruksi"
            >
              <span>Teknik</span>
              {hoveredNode === 'teknik' && (
                <span style={{ fontSize: '0.68rem', color: '#ea580c', fontWeight: 700, marginTop: '2px' }}>
                  Konstruksi & Absen ➔
                </span>
              )}
            </button>

            {/* Node: legal */}
            <button
              type="button"
              className="ams-hub-node-btn"
              onClick={() => onSelectModule('legal')}
              onMouseEnter={() => setHoveredNode('legal')}
              onMouseLeave={() => setHoveredNode(null)}
              style={getNodeStyle('legal', 'right')}
              title="Buka Modul Legal Corporate, SPK & Perizinan"
            >
              <span>legal</span>
              {hoveredNode === 'legal' && (
                <span style={{ fontSize: '0.68rem', color: '#ea580c', fontWeight: 700, marginTop: '2px' }}>
                  SPK, Izin & Legal ➔
                </span>
              )}
            </button>
          </div>

          {/* Center Circle (Ashoka Management System) */}
          <div
            className="ams-hub-circle-box"
            style={{
              width: '270px',
              height: '270px',
              borderRadius: '50%',
              border: '2.5px solid #000000',
              background: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: hoveredNode ? '0 10px 30px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.3s ease',
              userSelect: 'none',
              cursor: 'default'
            }}
          >
            <div
              className="ams-hub-circle-text"
              style={{
                fontSize: '1.45rem',
                fontWeight: 900,
                color: '#000000',
                lineHeight: 1.22,
                textAlign: 'center'
              }}
            >
              <div>Ashoka</div>
              <div>Management</div>
              <div>System</div>
            </div>
          </div>

          {/* Right Column (Marketing & HR & GA) */}
          <div
            className="ams-hub-side-col"
            style={{
              width: '170px',
              height: '270px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'flex-start'
            }}
          >
            {/* Node: Marketing */}
            <button
              type="button"
              className="ams-hub-node-btn"
              onClick={() => onSelectModule('marketing')}
              onMouseEnter={() => setHoveredNode('marketing')}
              onMouseLeave={() => setHoveredNode(null)}
              style={getNodeStyle('marketing', 'left')}
              title="Buka Modul Marketing & Penjualan"
            >
              <span>Marketing</span>
              {hoveredNode === 'marketing' && (
                <span style={{ fontSize: '0.68rem', color: '#ea580c', fontWeight: 700, marginTop: '2px' }}>
                  Penjualan Unit ➔
                </span>
              )}
            </button>

            {/* Node: HR & GA */}
            <button
              type="button"
              className="ams-hub-node-btn"
              onClick={() => onSelectModule('hr-ga')}
              onMouseEnter={() => setHoveredNode('hr-ga')}
              onMouseLeave={() => setHoveredNode(null)}
              style={getNodeStyle('hr-ga', 'left')}
              title="Buka Modul HR & GA"
            >
              <span>HR & GA</span>
              {hoveredNode === 'hr-ga' && (
                <span style={{ fontSize: '0.68rem', color: '#ea580c', fontWeight: 700, marginTop: '2px' }}>
                  SDM & Aset Kantor ➔
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 3. BOTTOM ELEMENT: FINANCE & TO -DO LIST */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '20px',
            gap: '10px'
          }}
        >
          {/* Node: Finance */}
          <button
            type="button"
            className="ams-hub-node-btn"
            onClick={() => onSelectModule('finance')}
            onMouseEnter={() => setHoveredNode('finance')}
            onMouseLeave={() => setHoveredNode(null)}
            style={getNodeStyle('finance', 'center')}
            title="Buka Modul Finance & Payment"
          >
            <span>Finance</span>
            {hoveredNode === 'finance' && (
              <span style={{ fontSize: '0.68rem', color: '#ea580c', fontWeight: 700, marginTop: '2px' }}>
                Keuangan & Kas Bank ➔
              </span>
            )}
          </button>

          {/* Node: TO -DO LIST */}
          <button
            type="button"
            className="ams-hub-node-btn"
            onClick={() => onSelectModule('todo-attendance')}
            onMouseEnter={() => setHoveredNode('todo-attendance')}
            onMouseLeave={() => setHoveredNode(null)}
            style={getNodeStyle('todo-attendance', 'center')}
            title="Buka Modul To-Do List Harian & Presensi"
          >
            <span>TO -DO LIST</span>
            {hoveredNode === 'todo-attendance' && (
              <span style={{ fontSize: '0.68rem', color: '#ea580c', fontWeight: 700, marginTop: '2px' }}>
                Agenda Kerja Harian ➔
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Helpful Hint Footer */}
      <div
        style={{
          marginTop: '2rem',
          fontSize: '0.76rem',
          color: '#64748b',
          textAlign: 'center',
          fontWeight: 600,
          userSelect: 'none'
        }}
      >
        💡 Klik pada nama departemen / modul untuk langsung masuk ke modul terkait.
      </div>
    </div>
  );
};
