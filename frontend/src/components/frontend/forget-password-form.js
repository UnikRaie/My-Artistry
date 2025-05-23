// components/forget-password-form.js
import React, { useState } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const ForgetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('${BACKEND_URL}/api/forget-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error resetting password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          {message && <p className="text-destructive mb-4">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgetPasswordForm;