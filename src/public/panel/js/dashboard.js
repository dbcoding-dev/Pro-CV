async function fetchData() {
    const response = await fetch('/api/analytics');
    const data = await response.json();
    return data;
}

function createChart(ctx, labels, data) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sessions',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createEmptyChart(ctx, message) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: [''],
            datasets: [{
                label: message,
                data: [0],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    display: false
                },
                x: {
                    display: false
                }
            }
        }
    });
}

async function renderCharts() {
    const data = await fetchData();

    if (data.rows.length === 0) {
        const message = "Veri yok";
        const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
        const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
        const yearlyCtx = document.getElementById('yearlyChart').getContext('2d');

        createEmptyChart(weeklyCtx, message);
        createEmptyChart(monthlyCtx, message);
        createEmptyChart(yearlyCtx, message);
        return;
    }

    // dates ve sessions için verileri ayıklayın
    const dates = data.rows.map(row => row.dimensionValues[0].value);
    const sessions = data.rows.map(row => parseInt(row.metricValues[0].value, 10));

    // Haftalık veri için
    const weeklyData = sessions.slice(-7); // Son 7 gün
    const weeklyLabels = dates.slice(-7);
    const weeklyCtx = document.getElementById('weeklyChart').getContext('2d');
    createChart(weeklyCtx, weeklyLabels, weeklyData);

    // Aylık veri için
    const monthlyData = sessions.slice(-30); // Son 30 gün
    const monthlyLabels = dates.slice(-30);
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    createChart(monthlyCtx, monthlyLabels, monthlyData);

    // Yıllık veri için
    const yearlyData = sessions; // Tüm yıl
    const yearlyLabels = dates;
    const yearlyCtx = document.getElementById('yearlyChart').getContext('2d');
    createChart(yearlyCtx, yearlyLabels, yearlyData);
}

renderCharts();