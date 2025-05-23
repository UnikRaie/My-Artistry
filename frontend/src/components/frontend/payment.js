import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const PaymentDetails = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/payments-info', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPayments(response.data);
      } catch (err) {
        setError('Failed to load payment details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-grow px-4 sm:px-8 md:px-16 py-10">
        <Card className="w-full">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {payments.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                No payment records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking</TableHead>
                      <TableHead>For</TableHead>
                      <TableHead>Paid To</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment._id}>
                        <TableCell className="max-w-[180px] truncate">{payment.booking._id}</TableCell>
                        <TableCell>{payment.For}</TableCell>
                        <TableCell>{payment.Paidto}</TableCell>
                        <TableCell>${payment.totalPrice}</TableCell>
                        <TableCell>{new Date(payment.paymentDate).toLocaleString()}</TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              payment.status === 'Paid'
                                ? 'bg-green-100 text-green-700'
                                : payment.status === 'Failed'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {payment.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentDetails;
