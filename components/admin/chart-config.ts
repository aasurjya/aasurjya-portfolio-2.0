export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: 'rgba(0,0,0,0.05)' }, beginAtZero: true }
  }
}

export const doughnutOptions = { ...chartOptions, cutout: '60%' }

export const hourlyLabels = Array.from({ length: 24 }, (_, i) => `${i}:00`)
