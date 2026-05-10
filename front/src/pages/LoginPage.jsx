import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth }  from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { authApi }  from '../api/notes'

export default function LoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const { saveAuth } = useAuth()
  const { addToast } = useToast()
  const navigate     = useNavigate()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: null })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      const { data } = await authApi.login(form)
      saveAuth(data.user, data.token)
      addToast('Connexion réussie ! Bienvenue ' + data.user.name)
      navigate('/notes')
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        addToast(err.response?.data?.message || 'Erreur de connexion.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Notes Personnelles
          </h1>
          <p className="text-gray-400 text-sm">Vos idées, organisées.</p>
        </div>

        <div className="card p-8 animate-fade-slide">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Connexion
          </h2>
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Adresse e-mail</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="vous@exemple.com"
                className={`input-field ${errors.email ? 'border-red-400' : ''}`}
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <input
                type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••"
                className={`input-field ${errors.password ? 'border-red-400' : ''}`}
                required
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-gray-900 font-semibold hover:underline">S'inscrire</Link>
          </p>
        </div>


      </div>
    </div>
  )
}
