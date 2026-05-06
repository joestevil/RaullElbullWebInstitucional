// KPI data (en producción vendría de Supabase)
const KPIS = [
  {
    id:       'membresia',
    label:    '%Membresía Activa',
    value:    80,
    display:  '80%',
    max:      100,
    unit:     '%',
  },
  {
    id:       'apds',
    label:    '# APDs',
    value:    5,
    display:  '5/7',
    max:      7,
    unit:     '',
  },
  {
    id:       'financiera',
    label:    '%Meta Financiera',
    value:    80,
    display:  '80%',
    max:      100,
    unit:     '%',
  },
]

function KpiCard({
  label,
  display,
  value,
  max,
}: {
  label:   string
  display: string
  value:   number
  max:     number
}) {
  const pct = Math.min((value / max) * 100, 100)

  return (
    <div
      style={{
        backgroundColor: '#CC0000',
        borderRadius:    '20px',
        padding:         '28px 24px 24px',
        display:         'flex',
        flexDirection:   'column',
        gap:             '20px',
        flex:            '1 1 200px',
        minWidth:        '180px',
        boxShadow:       '0 4px 20px rgba(180,0,0,0.25)',
      }}
    >
      {/* Label */}
      <p
        style={{
          color:      'white',
          fontWeight: 700,
          fontSize:   '17px',
          lineHeight: 1.25,
          textAlign:  'center',
        }}
      >
        {label}
      </p>

      {/* Progress pill */}
      <div
        style={{
          position:        'relative',
          backgroundColor: 'white',
          borderRadius:    '999px',
          height:          '48px',
          display:         'flex',
          alignItems:      'center',
          paddingLeft:     '20px',
          overflow:        'hidden',
        }}
      >
        {/* Value text */}
        <span
          style={{
            color:      '#CC0000',
            fontWeight: 800,
            fontSize:   '22px',
            zIndex:     2,
            position:   'relative',
          }}
        >
          {display}
        </span>

        {/* Progress fill from right */}
        <div
          style={{
            position:        'absolute',
            right:           0,
            top:             0,
            bottom:          0,
            width:           `${100 - pct + 15}%`,
            backgroundColor: 'rgba(220,60,60,0.22)',
            borderRadius:    '999px',
            zIndex:          1,
          }}
        />
        {/* Pink circle indicator (right cap) */}
        <div
          style={{
            position:        'absolute',
            right:           '-10px',
            top:             '50%',
            transform:       'translateY(-50%)',
            width:           '54px',
            height:          '54px',
            borderRadius:    '50%',
            backgroundColor: 'rgba(220,60,60,0.32)',
            zIndex:          1,
          }}
        />
      </div>
    </div>
  )
}

export default function MetasPage() {
  return (
    <div className="responsive-page">
      {/* Title */}
      <h1
        style={{
          fontWeight:    900,
          fontSize:      '36px',
          color:         '#111827',
          marginBottom:  '28px',
          letterSpacing: '-0.03em',
        }}
      >
        METAS Y KPIs
      </h1>

      {/* Container card */}
      <div
        className="card-frictionless"
        style={{ padding: '28px' }}
      >
        {/* KPI cards row */}
        <div
          style={{
            display:   'flex',
            gap:       '20px',
            flexWrap:  'wrap',
          }}
        >
          {KPIS.map((kpi) => (
            <KpiCard
              key={kpi.id}
              label={kpi.label}
              display={kpi.display}
              value={kpi.value}
              max={kpi.max}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
