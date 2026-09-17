import { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'

const API = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.251:5000'

export default function App() {
  const [status, setStatus] = useState(null)
  const [portfolio, setPortfolio] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      try {
        const [statusResponse, portfolioResponse] = await Promise.allSettled([
          fetch(`${API}/status`),
          fetch(`${API}/api/portfolio`)
        ])
        if (!active) return

        if (statusResponse.status === 'fulfilled' && statusResponse.value.ok) {
          setStatus(await statusResponse.value.json())
        }
        if (portfolioResponse.status === 'fulfilled' && portfolioResponse.value.ok) {
          setPortfolio(await portfolioResponse.value.json())
        }

        const failedRequest = [statusResponse, portfolioResponse].find(
          (result) => result.status === 'rejected' || !result.value?.ok
        )
        setError(failedRequest ? `Cannot reach ${API}` : null)
      } catch (requestError) {
        if (active) setError(`${requestError.message} (${API})`)
      }
    }

    loadDashboard()
    const timer = setInterval(loadDashboard, 5000)
    return () => { active = false; clearInterval(timer) }
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>NNIT AI TRADER</Text>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Trading monitor</Text>
          <Text style={[styles.badge, error ? styles.offline : styles.online]}>{error ? 'OFFLINE' : 'ONLINE'}</Text>
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.grid}>
          <Metric label="BOT STATUS" value={status?.status || '...'} />
          <Metric label="UPTIME" value={status ? `${Math.floor(status.uptime)} sec` : '...'} />
          <Metric label="CASH" value={portfolio ? `$${Number(portfolio.cash).toFixed(2)}` : '...'} />
          <Metric label="P&L" value={portfolio ? `$${Number(portfolio.pnl).toFixed(2)}` : '...'} />
        </View>
        <Text style={styles.sectionTitle}>Portfolio</Text>
        <View style={styles.panel}>
          <Text style={styles.code}>{portfolio ? JSON.stringify(portfolio, null, 2) : 'Waiting for portfolio data...'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function Metric({ label, value }) {
  return <View style={styles.metric}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0b1220' },
  container: { padding: 24, gap: 18 },
  eyebrow: { color: '#7dd3fc', fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  headerRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  title: { color: '#f8fafc', fontSize: 30, fontWeight: '800' },
  badge: { borderRadius: 6, fontSize: 11, fontWeight: '800', paddingHorizontal: 10, paddingVertical: 7 },
  online: { backgroundColor: '#14532d', color: '#bbf7d0' },
  offline: { backgroundColor: '#7f1d1d', color: '#fecaca' },
  error: { backgroundColor: '#451a03', color: '#fed7aa', padding: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metric: { backgroundColor: '#172033', borderColor: '#26344d', borderRadius: 8, borderWidth: 1, minWidth: '47%', padding: 16 },
  label: { color: '#94a3b8', fontSize: 11, fontWeight: '700', marginBottom: 8 },
  value: { color: '#f8fafc', fontSize: 20, fontWeight: '800' },
  sectionTitle: { color: '#f8fafc', fontSize: 20, fontWeight: '800', marginTop: 8 },
  panel: { backgroundColor: '#111827', borderRadius: 8, padding: 16 },
  code: { color: '#cbd5e1', fontFamily: 'monospace', fontSize: 13, lineHeight: 20 }
})
