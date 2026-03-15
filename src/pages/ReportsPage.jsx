import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { getReportSummary, getReportByModel, getReportByCurrency } from '../api/subscriptionApi'
import Layout from '../components/Layout'

const COLORS = {
  MONTHLY: '#f97316',
  YEARLY: '#818cf8',
  PLN: '#f97316',
  USD: '#22c55e',
  EUR: '#3b82f6',
}

function formatPrice(price, currency = 'PLN') {
  return Number(price).toLocaleString('pl-PL', { style: 'currency', currency })
}

function KpiCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1.5px solid var(--border)',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow-sm)',
      padding: '22px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      borderTop: `3px solid ${accent}`,
    }}>
      <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '26px', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{value}</p>
      {sub && <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-dim)' }}>{sub}</p>}
    </div>
  )
}

function ChartCard({ title, subtitle, children, loading }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1.5px solid var(--border)',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
    }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>{title}</h2>
        {subtitle && <p style={{ margin: '3px 0 0', fontSize: '13px', color: 'var(--text-dim)' }}>{subtitle}</p>}
      </div>
      <div style={{ padding: '24px' }}>
        {loading ? (
          <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Ładowanie...</span>
          </div>
        ) : children}
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, currency }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', boxShadow: 'var(--shadow-md)', fontSize: '13px' }}>
      <p style={{ margin: '0 0 4px', fontWeight: 700, color: 'var(--text)' }}>{d.name || d.model || d.currency}</p>
      <p style={{ margin: '0 0 2px', color: 'var(--text-dim)' }}>Koszt/mies.: <strong style={{ color: 'var(--text)' }}>{formatPrice(payload[0].value, currency)}</strong></p>
      <p style={{ margin: 0, color: 'var(--text-dim)' }}>Liczba: <strong style={{ color: 'var(--text)' }}>{d.count}</strong></p>
    </div>
  )
}

export default function ReportsPage() {
  const [summary, setSummary] = useState(null)
  const [byModel, setByModel] = useState([])
  const [byCurrency, setByCurrency] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      getReportSummary(),
      getReportByModel(),
      getReportByCurrency(),
    ]).then(([s, m, c]) => {
      setSummary(s.data.data)
      setByModel(m.data.data || [])
      setByCurrency(c.data.data || [])
    }).catch(() => {
      setError('Nie udało się pobrać danych raportów.')
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const displayCurrency = summary?.currency || 'PLN'

  const pieData = byModel.map(d => ({
    name: d.model === 'MONTHLY' ? 'Miesięczne' : 'Roczne',
    value: Number(d.monthlyCost),
    count: d.count,
    model: d.model,
  }))

  const barData = byCurrency.map(d => ({
    name: d.currency,
    value: Number(d.monthlyCost),
    count: d.count,
    currency: d.currency,
  }))

  const monthly = byModel.find(d => d.model === 'MONTHLY')
  const yearly = byModel.find(d => d.model === 'YEARLY')

  return (
    <Layout>
      <div style={{ maxWidth: '900px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>Raporty</h1>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-dim)' }}>Podsumowanie Twoich subskrypcji</p>
        </div>

        {error && <div className="alert-error" style={{ marginBottom: '20px' }}>{error}</div>}

        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <KpiCard
            label="Wszystkie subskrypcje"
            value={loading ? '—' : summary?.totalCount ?? 0}
            sub={loading ? '' : `${monthly?.count ?? 0} mies. · ${yearly?.count ?? 0} roczne`}
            accent="var(--orange)"
          />
          <KpiCard
            label="Koszt miesięczny"
            value={loading ? '—' : formatPrice(summary?.monthlyCost ?? 0, displayCurrency)}
            sub="suma wszystkich (mies. equiv.)"
            accent="#818cf8"
          />
          <KpiCard
            label="Koszt roczny"
            value={loading ? '—' : formatPrice(summary?.yearlyCost ?? 0, displayCurrency)}
            sub="prognoza na 12 miesięcy"
            accent="#22c55e"
          />
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>

          {/* Pie: by model */}
          <ChartCard
            title="Podział wg modelu"
            subtitle="Miesięczne vs roczne subskrypcje"
            loading={loading}
          >
            {pieData.length === 0 ? (
              <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Brak danych</span>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {pieData.map((d) => (
                        <Cell key={d.model} fill={COLORS[d.model]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip currency={displayCurrency} />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '8px' }}>
                  {pieData.map(d => (
                    <div key={d.model} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[d.model] }} />
                      <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{d.name} ({d.count})</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </ChartCard>

          {/* Bar: by currency */}
          <ChartCard
            title="Podział wg waluty"
            subtitle={`Koszt mies. w ${displayCurrency}`}
            loading={loading}
          >
            {barData.length === 0 ? (
              <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>Brak danych</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} barCategoryGap="40%">
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-dim)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-dim)' }} axisLine={false} tickLine={false} width={50} tickFormatter={(v) => v.toFixed(0)} />
                  <Tooltip content={<CustomTooltip currency={displayCurrency} />} cursor={{ fill: 'var(--orange-dim)' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {barData.map((d) => (
                      <Cell key={d.currency} fill={COLORS[d.currency] || 'var(--orange)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Model breakdown detail */}
        {!loading && byModel.length > 0 && (
          <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>Szczegóły</h2>
            </div>
            <div>
              {byModel.map((d, i) => (
                <div key={d.model} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 24px',
                  borderBottom: i < byModel.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[d.model], flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                        {d.model === 'MONTHLY' ? 'Miesięczne' : 'Roczne'}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-dim)' }}>{d.count} {d.count === 1 ? 'subskrypcja' : 'subskrypcje'}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>{formatPrice(d.monthlyCost, displayCurrency)}<span style={{ fontSize: '12px', fontWeight: 400, color: 'var(--text-dim)' }}>/mies.</span></p>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-dim)' }}>{formatPrice(Number(d.monthlyCost) * 12, displayCurrency)}/rok</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}
