'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Calendar,
  Package,
  FileText,
  Copy,
  ExternalLink,
  Edit,
  Save,
  X,
} from 'lucide-react';
import { Purchase, PurchaseStatus } from './types';
import { formatCurrency, formatDate, getStatusConfig } from './purchaseUtils';

interface PurchaseDetailsModalProps {
  purchase: Purchase | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: (purchaseId: string, newStatus: PurchaseStatus) => Promise<void>;
}

const PurchaseDetailsModal: React.FC<PurchaseDetailsModalProps> = ({
  purchase,
  isOpen,
  onClose,
  onStatusUpdate,
}) => {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<PurchaseStatus>('PENDING');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!purchase) return null;

  const statusConfig = getStatusConfig(purchase.status);
  const StatusIcon = statusConfig.icon;

  const handleStatusUpdate = async () => {
    if (!onStatusUpdate) return;

    setIsUpdating(true);
    try {
      await onStatusUpdate(purchase._id, newStatus);
      setIsEditingStatus(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here if needed
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Purchase Details</span>
            <div className="flex items-center gap-2">
              {isEditingStatus ? (
                <div className="flex items-center gap-2">
                  <Select
                    value={newStatus}
                    onValueChange={(value: PurchaseStatus) => setNewStatus(value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="SUCCESS">Success</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handleStatusUpdate} disabled={isUpdating}>
                    <Save className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditingStatus(false)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge className={`${statusConfig.color} flex items-center gap-1`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig.label}
                  </Badge>
                  {onStatusUpdate && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setNewStatus(purchase.status);
                        setIsEditingStatus(true);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>Detailed information about order {purchase.orderId}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="course">Course</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Order Information</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Order ID</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{purchase.orderId}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(purchase.orderId)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="font-semibold">
                      {formatCurrency(purchase.amount, purchase.currency)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Currency</span>
                    <span>{purchase.currency}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span>{formatDate(purchase.createdAt)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span>{formatDate(purchase.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Quick Actions</h3>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => copyToClipboard(purchase.userDetails?.email || '')}
                    disabled={!purchase.userDetails?.email}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Customer
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    disabled={!purchase.courseDetails?.slug}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Course
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => copyToClipboard(purchase.orderId)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Order ID
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customer" className="space-y-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Customer Information</h3>
            </div>

            {purchase.userDetails ? (
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="" alt={purchase.userDetails.name} />
                    <AvatarFallback className="text-lg bg-blue-100 text-blue-700">
                      {getUserInitials(purchase.userDetails.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="text-lg font-semibold">{purchase.userDetails.name}</h4>
                      <p className="text-muted-foreground">Customer</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{purchase.userDetails.email}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(purchase.userDetails!.email)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{purchase.userDetails.phone}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(purchase.userDetails!.phone)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Customer information not available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="course" className="space-y-6">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Course Information</h3>
            </div>

            {purchase.courseDetails ? (
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold">{purchase.courseDetails.title}</h4>
                    <p className="text-muted-foreground">Course</p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Price</label>
                        <p className="text-lg font-semibold">
                          {formatCurrency(
                            purchase.courseDetails.price.amount,
                            purchase.courseDetails.price.currency
                          )}
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Course Slug
                        </label>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-mono">{purchase.courseDetails.slug}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(purchase.courseDetails!.slug)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Course ID
                        </label>
                        <p className="text-sm font-mono">{purchase.courseId}</p>
                      </div>

                      {purchase.courseDetails.description && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            Description
                          </label>
                          <p className="text-sm">{purchase.courseDetails.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {purchase.couponDetails && (
                    <>
                      <Separator />
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h5 className="font-semibold text-green-800 mb-2">Coupon Applied</h5>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-green-600 font-medium">Code:</span>
                            <span className="ml-2 font-mono">{purchase.couponDetails.code}</span>
                          </div>
                          <div>
                            <span className="text-green-600 font-medium">Discount:</span>
                            <span className="ml-2">
                              {purchase.couponDetails.discountType === 'percentage'
                                ? `${purchase.couponDetails.discount}%`
                                : formatCurrency(purchase.couponDetails.discount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Course information not available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Technical Details</h3>
            </div>

            <div className="space-y-4">
              {/* Raw Response */}
              {purchase.rawResponse && (
                <div>
                  <h4 className="font-semibold mb-3">Payment Gateway Response</h4>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-xs">{JSON.stringify(purchase.rawResponse, null, 2)}</pre>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div>
                <h4 className="font-semibold mb-3">Timestamps</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Created At
                      </label>
                      <p className="text-sm">{formatDate(purchase.createdAt)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Updated At
                      </label>
                      <p className="text-sm">{formatDate(purchase.updatedAt)}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Purchase ID
                      </label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-mono">{purchase._id}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(purchase._id)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDetailsModal;
