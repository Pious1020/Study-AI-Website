import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Settings, User, Mail, Calendar } from 'lucide-react';
import Avatar from './Avatar';

export default function AccountSettings() {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-apple-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="apple-card text-center py-12">
            <Settings className="h-12 w-12 text-apple-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-apple-gray-900 mb-2">
              Sign in to Access Account Settings
            </h2>
            <p className="text-apple-gray-500 mb-6">
              Please sign in to view and manage your account settings.
            </p>
            <button
              onClick={() => loginWithRedirect()}
              className="apple-button"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-apple-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="apple-card">
          <div className="text-center pb-8 border-b border-apple-gray-100">
            <div className="mb-4 flex justify-center">
              <Avatar src={user?.picture} name={user?.name} size="lg" />
            </div>
            <h1 className="text-2xl font-medium text-apple-gray-900">
              Account Settings
            </h1>
          </div>

          <div className="py-6 space-y-6">
            <div className="flex items-start space-x-4">
              <User className="h-5 w-5 text-apple-gray-400 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-apple-gray-900">Name</h3>
                <p className="text-sm text-apple-gray-500">{user?.name}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="h-5 w-5 text-apple-gray-400 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-apple-gray-900">Email</h3>
                <p className="text-sm text-apple-gray-500">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Calendar className="h-5 w-5 text-apple-gray-400 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-apple-gray-900">
                  Account Created
                </h3>
                <p className="text-sm text-apple-gray-500">
                  {user?.updated_at
                    ? new Date(user.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Not available'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-apple-gray-100">
            <p className="text-sm text-apple-gray-500">
              To update your profile information, please visit your Auth0 profile settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
