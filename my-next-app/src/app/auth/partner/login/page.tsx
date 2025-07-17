import React from 'react'
import Login from '../../components/Login';

const LoginPage = () => {
  return (
    <div className="h-[90vh] flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Login />
      </div>
    </div>
  );
}

export default LoginPage