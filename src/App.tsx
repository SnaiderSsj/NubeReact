import { useState, useEffect } from 'react'
import axios from 'axios'
import Loader from './components/atoms/Loader'
import Card from './components/atoms/Card'

const API_BASE = "https://contabilidad-orquestador-production.up.railway.app/api/Contabilidad"

type Tab = 'resumen' | 'clientes' | 'facturas' | 'pagos'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('resumen')
  const [reporte, setReporte] = useState<any>(null)
  const [clientes, setClientes] = useState<any[]>([])
  const [facturas, setFacturas] = useState<any[]>([])
  const [pagos, setPagos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        const [rep, cli, fac, pag] = await Promise.all([
          axios.get(`${API_BASE}/reporte-morosidad`),
          axios.get(`${API_BASE}/clientes`),
          axios.get(`${API_BASE}/facturas`),
          axios.get(`${API_BASE}/pagos`)
        ])
        setReporte(rep.data)
        setClientes(cli.data)
        setFacturas(fac.data)
        setPagos(pag.data)
      } catch (err: any) {
        setError('Error cargando datos del orquestador')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return <Loader />
  if (error) return <div className="text-center text-red-600 text-2xl p-10">{error}</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="container mx-auto p-6 max-w-7xl">
        <h1 className="text-5xl font-bold text-center my-10 text-indigo-800">
          Orquestador Contabilidad - Dashboard
        </h1>

        {/* Pestañas */}
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          {(['resumen', 'clientes', 'facturas', 'pagos'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-xl'
                  : 'bg-white text-indigo-700 shadow hover:shadow-lg'
              }`}
            >
              {tab === 'resumen' && 'Resumen Morosidad'}
              {tab === 'clientes' && 'Clientes'}
              {tab === 'facturas' && 'Facturas'}
              {tab === 'pagos' && 'Pagos'}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="grid gap-8">
          {activeTab === 'resumen' && reporte && (
            <Card>
              <h2 className="text-4xl font-bold text-center mb-8">Reporte General de Morosidad</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-green-100 p-6 rounded-xl text-center">
                  <p className="text-5xl font-bold text-green-700">{reporte.resumen.alDia}</p>
                  <p className="text-xl">Al día</p>
                </div>
                <div className="bg-yellow-100 p-6 rounded-xl text-center">
                  <p className="text-5xl font-bold text-yellow-700">{reporte.resumen.enObservacion}</p>
                  <p className="text-xl">En Observación</p>
                </div>
                <div className="bg-red-100 p-6 rounded-xl text-center">
                  <p className="text-5xl font-bold text-red-700">{reporte.resumen.morosos}</p>
                  <p className="text-xl">Morosos</p>
                </div>
                <div className="bg-purple-100 p-6 rounded-xl text-center">
                  <p className="text-5xl font-bold text-purple-700">Bs. {Number(reporte.totalDeudaGeneral).toLocaleString()}</p>
                  <p className="text-xl">Deuda Total</p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'clientes' && (
            <Card>
              <h2 className="text-3xl font-bold mb-6">Lista de Clientes ({clientes.length})</h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="p-4">CI</th>
                      <th className="p-4">Nombre</th>
                      <th className="p-4">Categoría</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.map((c, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="p-4 text-center font-mono">{c.ci}</td>
                        <td className="p-4">{c.nombre}</td>
                        <td className="p-4 text-center">{c.categoria}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === 'facturas' && (
            <Card>
              <h2 className="text-3xl font-bold mb-6">Facturas ({facturas.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facturas.map(f => (
                  <div key={f.codigo} className="bg-indigo-50 p-6 rounded-xl border-2 border-indigo-200">
                    <p className="text-2xl font-bold"># {f.codigo}</p>
                    <p>CI Cliente: <strong>{f.clienteCi}</strong></p>
                    <p>Monto: <strong>Bs. {f.montoTotal}</strong></p>
                    <p className="text-sm text-gray-600">{new Date(f.fecha).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'pagos' && (
            <Card>
              <h2 className="text-3xl font-bold mb-6">Pagos ({pagos.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pagos.map(p => (
                  <div key={p.codigo} className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                    <p className="text-2xl font-bold">Factura #{p.facturaCodigo}</p>
                    <p>Monto Pagado: <strong>Bs. {p.montoPagado}</strong></p>
                    <p className="text-sm text-gray-600">{new Date(p.fechaPago).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default App