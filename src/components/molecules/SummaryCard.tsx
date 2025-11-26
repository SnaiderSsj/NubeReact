import Card from '../atoms/Card'

export default function SummaryCard({ title, value, color = 'blue' }: { title: string; value: number; color?: 'blue'|'green'|'red'|'yellow' }) {
  const bg = color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-green-100' : color === 'red' ? 'bg-red-100' : 'bg-yellow-100'
  return (
    <Card className={`${bg} text-center`}>
      <p className="text-lg opacity-80">{title}</p>
      <p className="text-4xl font-bold mt-2">Bs. {value.toLocaleString()}</p>
    </Card>
  )
}