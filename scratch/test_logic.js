const axios = require('axios');

async function test() {
  const { data: entries } = await axios.get('http://localhost:4000/api/entries?userId=user_123');
  
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const chartData = months.map(name => ({ name, income: 0, expense: 0 }));
  const selectedFY = '2025-26';

  entries.forEach(entry => {
    if (entry.financialYear === selectedFY && entry.status !== 'EXCLUDED') {
      const date = new Date(entry.date);
      const monthIndex = date.getMonth(); 
      const mappedIndex = monthIndex >= 3 ? monthIndex - 3 : monthIndex + 9;
      
      if (entry.category === 'INCOME') {
        chartData[mappedIndex].income += entry.amount;
      } else if (entry.category === 'EXPENSE') {
        chartData[mappedIndex].expense += entry.amount;
      }
    }
  });

  console.log(chartData);
}

test();
