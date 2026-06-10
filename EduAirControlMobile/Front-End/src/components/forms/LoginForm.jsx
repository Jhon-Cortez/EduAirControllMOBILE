import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../schemas/loginSchema'
import { Input } from '../ui'
import '../../styles/auth/Login.css'

function LoginForm() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = (data) => {
    console.log(data)
    navigate('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div className="input-group">
        <Input
          {...register("email")}
          label={t('login.email')}
          placeholder={t('login.placeholderEmail')}
          className={errors.email ? "input-error shake" : ""}
        />
        {errors.email && (
          <p className="error-text">
            ⚠{t(errors.email.message)}
          </p>)}
      </div>

      <div className="input-group password-group">
        <Input
          {...register("password")}
          label={t('login.password')}
          placeholder={t('login.placeholderPassword')}
          type="password"
          className={errors.password ? "input-error shake" : ""}
        />
        {errors.password &&
          <p className="error-text">
            ⚠{t(errors.password.message)}
          </p>}
      </div>

      <div className="login-options">
        <label className="remember-me">
          <input
            type="checkbox"
            {...register('rememberMe')}
          />
          {t('login.rememberMe')}
        </label>
        <a
          href="#"
          className="forgot-password"
          onClick={(e) => { e.preventDefault(); navigate('/forgot-password') }}
        >
          {t('login.forgotPassword')}
        </a>
      </div>

      <button
        type="submit"
        className="btn-login"
        disabled={isSubmitting}
      >
        {isSubmitting ? "..." : t('login.title')}
      </button>

      {isSubmitting && <p className="loading">Validando...</p>}
    </form>
  )
}

export default LoginForm