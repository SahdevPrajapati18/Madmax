import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import '../styles/Register.css';

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      userType: 'user'
    }
  });

  const onSubmit = async (data) => {
    setError(''); // Clear any previous errors
    
    try {
        const response = await axios.post("http://localhost:3000/api/auth/register", {
            email: data.email.trim(),
            fullname: {
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim()
            },
            password: data.password,
            role: data.userType
        }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.user) {
            // Successful registration
            navigate('/');
        }
    } catch (err) {
        if (err.response) {
            // Server responded with an error
            const errorMessage = err.response.data?.message || "Registration failed";
            setError(errorMessage);
            console.error("Server error:", err.response.data);
        } else if (err.request) {
            // Request was made but no response
            setError("No response from server. Please check your connection.");
            console.error("Network error:", err.request);
        } else {
            // Error in request setup
            setError("Unable to make registration request");
            console.error("Request setup error:", err.message);
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Create Account
        </h1>
        
        <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
          <img 
            src="/src/assets/Google_Favicon_2025.svg.png"
            alt="Google logo" 
            className="w-6 h-6 object-contain"
          />
          Continue with Google
        </button>

        <div className="relative flex items-center my-8">
          <div className="grow border-t border-gray-200 dark:border-gray-700"></div>
          <span className="shrink mx-4 text-gray-400 dark:text-gray-500 text-sm">or</span>
          <div className="grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              I want to register as:
            </label>
            <div className="flex gap-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="user"
                  value="user"
                  {...register("userType")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="user" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  User
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="artist"
                  value="artist"
                  {...register("userType")}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600"
                />
                <label htmlFor="artist" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Artist
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="John"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                {...register("firstName", {
                  required: "First name is required",
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 characters"
                  }
                })}
              />
              {errors.firstName && (
                <span className="text-sm text-red-600 dark:text-red-400">{errors.firstName.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                {...register("lastName", {
                  required: "Last name is required",
                  minLength: {
                    value: 2,
                    message: "Last name must be at least 2 characters"
                  }
                })}
              />
              {errors.lastName && (
                <span className="text-sm text-red-600 dark:text-red-400">{errors.lastName.message}</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="johndoe@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <span className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                  message: "Password must contain at least one letter and one number"
                }
              })}
            />
            {errors.password && (
              <span className="text-sm text-red-600 dark:text-red-400">{errors.password.message}</span>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 dark:bg-red-900/10 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
