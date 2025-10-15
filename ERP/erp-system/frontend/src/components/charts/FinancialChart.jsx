import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FinancialChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="receivable" stroke="#10b981" name="A Receber" />
        <Line type="monotone" dataKey="payable" stroke="#ef4444" name="A Pagar" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default FinancialChart;