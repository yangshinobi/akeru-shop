import React, { useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '../features/users/userSlice';

const LoginPage = () => {
    const [userId, setUserId] = useState('');
    const dispatch = useDispatch();
    
    // Select user state from Redux store
    const { status, error, userName, email } = useSelector((state) => state.user);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userId.trim()) {
            dispatch(fetchUserDetails(userId));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Login to your account
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="userId" className="sr-only">User ID</label>
                            <input
                                id="userId"
                                name="userId"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Enter User ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                            {status === 'loading' ? 'Loading...' : 'Sign in'}
                        </button>
                    </div>
                </form>

                {/* Show error message if any */}
                {error && (
                    <div className="mt-4 text-red-600 text-center">
                        {error}
                    </div>
                )}

                {/* Show user details if login successful */}
                {status === 'succeeded' && (
                    <div className="mt-4 p-4 bg-green-50 rounded-md">
                        <h3 className="text-lg font-medium text-green-800">Login Successful!</h3>
                        <div className="mt-2 text-sm text-green-700">
                            <p>Welcome, {userName}</p>
                            <p>Email: {email}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;