import { useState } from 'react'
import Input from '../atoms/Input'
import Button from '../atoms/Button'

interface Props {
  onSearch: (ci: string) => void
  disabled: boolean
}

export default function SearchForm({ onSearch, disabled }: Props) {
  const [ci, setCi] = useState('')
  const buscar = () => ci.trim() && onSearch(ci.trim())

  return (
    <div className="max-w-2xl mx-auto mb-12">
      <div className="bg-white rounded-2xl shadow-2xl p-10">
        <h2 className="text-3xl font-bold text-center mb-8">Buscar por CI</h2>
        <div className="flex gap-4">
          <Input placeholder="Ej: 32320" value={ci} onChange={e => setCi(e.target.value)} onKeyPress={e => e.key === 'Enter' && buscar()} />
          <Button onClick={buscar} disabled={disabled || !ci.trim()}>Buscar</Button>
        </div>
      </div>
    </div>
  )
}