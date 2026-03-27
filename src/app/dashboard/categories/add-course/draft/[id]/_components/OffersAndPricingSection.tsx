'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MdDelete } from 'react-icons/md';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  IndianRupee,
  Percent,
  Tag,
  CreditCard,
  ShieldCheck,
  CalendarClock,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { TDraftCourseForm } from '../page';

// ─── Types (local, matching schema shape) ───────────────────────────────────

type OfferType = 'coupon' | 'discount' | 'referral' | 'flash';
type DiscountType = 'flat' | 'percentage';

interface OfferDraft {
  type: OfferType;
  discountType: DiscountType;
  value: number | '';
  code: string;
  description: string;
  maxDiscountAmount: number | '';
  minOrderAmount: number | '';
  validFrom: string;
  validUntil: string;
  usageLimit: number | '';
  isActive: boolean;
}

interface InstallmentDraft {
  installmentNumber: number;
  amount: number | '';
  dueDate: string;
  label: string;
}

const emptyOffer = (): OfferDraft => ({
  type: 'discount',
  discountType: 'percentage',
  value: '',
  code: '',
  description: '',
  maxDiscountAmount: '',
  minOrderAmount: '',
  validFrom: '',
  validUntil: '',
  usageLimit: '',
  isActive: true,
});

// ─── Component ───────────────────────────────────────────────────────────────

export default function OffersAndPricingSection({
  watch,
  setValue,
  register,
  formState,
}: {
  watch: UseFormReturn<TDraftCourseForm>['watch'];
  setValue: UseFormReturn<TDraftCourseForm>['setValue'];
  register: UseFormReturn<TDraftCourseForm>['register'];
  formState: UseFormReturn<TDraftCourseForm>['formState'];
}) {
  const [offerDraft, setOfferDraft] = useState<OfferDraft>(emptyOffer());
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [installmentDraft, setInstallmentDraft] = useState<InstallmentDraft>({
    installmentNumber: 1,
    amount: '',
    dueDate: '',
    label: '',
  });

  const isPaid = watch('isPaid');
  const gstPercentage = watch('gst.percentage') ?? 18;
  const gstInclusive = watch('gst.isInclusive') ?? false;
  const priceAmount = watch('price.amount') ?? 0;
  const offers = watch('offers') ?? [];
  const partialAllowed = watch('partialPayment.isAllowed') ?? false;
  const installments = watch('partialPayment.installments') ?? [];

  // ── Computed price display ────────────────────────────────────────────────

  const basePrice = Number(priceAmount) || 0;
  const gstAmount = gstInclusive
    ? basePrice - basePrice / (1 + gstPercentage / 100)
    : basePrice * (gstPercentage / 100);
  const totalPrice = gstInclusive ? basePrice : basePrice + gstAmount;

  // ── Offer helpers ─────────────────────────────────────────────────────────

  const addOffer = () => {
    if (!offerDraft.value) return;
    setValue('offers', [
      ...offers,
      {
        ...offerDraft,
        value: Number(offerDraft.value),
        maxDiscountAmount: offerDraft.maxDiscountAmount
          ? Number(offerDraft.maxDiscountAmount)
          : undefined,
        minOrderAmount: offerDraft.minOrderAmount ? Number(offerDraft.minOrderAmount) : undefined,
        usageLimit: offerDraft.usageLimit ? Number(offerDraft.usageLimit) : undefined,
        usedCount: 0,
        validFrom: offerDraft.validFrom ? new Date(offerDraft.validFrom) : undefined,
        validUntil: offerDraft.validUntil ? new Date(offerDraft.validUntil) : undefined,
      },
    ]);
    setOfferDraft(emptyOffer());
    setShowOfferForm(false);
  };

  const removeOffer = (index: number) => {
    setValue(
      'offers',
      offers.filter((_, i) => i !== index)
    );
  };

  const toggleOfferActive = (index: number) => {
    const updated = [...offers];
    updated[index] = { ...updated[index], isActive: !updated[index].isActive };
    setValue('offers', updated);
  };

  // ── Installment helpers ───────────────────────────────────────────────────

  const addInstallment = () => {
    if (!installmentDraft.amount || !installmentDraft.dueDate) return;
    setValue('partialPayment.installments', [
      ...installments,
      {
        ...installmentDraft,
        installmentNumber: installments.length + 1,
        amount: Number(installmentDraft.amount),
        dueDate: new Date(installmentDraft.dueDate),
      },
    ]);
    setInstallmentDraft({
      installmentNumber: installments.length + 2,
      amount: '',
      dueDate: '',
      label: '',
    });
  };

  const removeInstallment = (index: number) => {
    const updated = installments
      .filter((_, i) => i !== index)
      .map((inst, i) => ({ ...inst, installmentNumber: i + 1 }));
    setValue('partialPayment.installments', updated);
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <section className="w-[85vw] mx-auto space-y-6 my-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <CreditCard className="text-blue-500 w-6 h-6" /> Pricing & Offers
      </h2>

      {/* ── Block 1: Base Price + GST ──────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        <h3 className="font-semibold text-gray-700 text-lg flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-green-600" /> Base Price
        </h3>

        {/* Paid toggle */}
        <div className="flex items-center gap-3">
          <Switch
            id="isPaid"
            checked={!!isPaid}
            onCheckedChange={checked => setValue('isPaid', checked)}
          />
          <Label htmlFor="isPaid" className="text-gray-700 font-medium">
            This is a paid course
          </Label>
        </div>

        {isPaid && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Price */}
            <div className="space-y-1">
              <Label className="text-sm text-gray-600">Price Amount (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  {...register('price.amount', { valueAsNumber: true })}
                  type="number"
                  placeholder="e.g. 4999"
                  className="pl-9"
                />
              </div>
              {formState.errors.price?.amount && (
                <p className="text-xs text-red-500">{formState.errors.price.amount.message}</p>
              )}
            </div>

            {/* Currency */}
            <div className="space-y-1">
              <Label className="text-sm text-gray-600">Currency</Label>
              <Select
                defaultValue={watch('price.currency') ?? 'INR'}
                onValueChange={val => setValue('price.currency', val as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {['INR', 'USD', 'EUR', 'GBP'].map(c => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* GST % */}
            <div className="space-y-1">
              <Label className="text-sm text-gray-600 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5" /> GST Percentage
              </Label>
              <Input
                {...register('gst.percentage', { valueAsNumber: true })}
                type="number"
                defaultValue={18}
                placeholder="18"
              />
              <p className="text-xs text-gray-400">
                18% applies to online ed-tech courses in India
              </p>
            </div>

            {/* GST inclusive toggle */}
            <div className="flex flex-col justify-end pb-1 space-y-2">
              <div className="flex items-center gap-3">
                <Switch
                  id="gstInclusive"
                  checked={!!gstInclusive}
                  onCheckedChange={checked => setValue('gst.isInclusive', checked)}
                />
                <Label htmlFor="gstInclusive" className="text-gray-700">
                  GST included in price
                </Label>
              </div>
              <p className="text-xs text-gray-400">
                {gstInclusive
                  ? 'Price shown already includes GST'
                  : 'GST will be added on top of price at checkout'}
              </p>
            </div>
          </div>
        )}

        {/* Price breakdown preview */}
        {isPaid && basePrice > 0 && (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex flex-col gap-1 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Base Price</span>
              <span>
                ₹{gstInclusive ? (basePrice - gstAmount).toFixed(2) : basePrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>GST ({gstPercentage}%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-800 border-t border-gray-200 pt-1 mt-1">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Block 2: Offers ───────────────────────────────────────────────── */}
      {isPaid && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 text-lg flex items-center gap-2">
              <Tag className="w-5 h-5 text-orange-500" /> Offers & Coupons
            </h3>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1"
              onClick={() => setShowOfferForm(v => !v)}
            >
              {showOfferForm ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showOfferForm ? 'Cancel' : 'Add Offer'}
            </Button>
          </div>

          {/* Existing offers list */}
          {offers.length > 0 && (
            <div className="space-y-3">
              {offers.map((offer, index) => (
                <div
                  key={index}
                  className={`flex items-start justify-between gap-4 p-4 rounded-lg border ${
                    offer.isActive
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold uppercase tracking-wide bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                        {offer.type}
                      </span>
                      {offer.code && (
                        <span className="text-xs font-mono bg-gray-200 px-2 py-0.5 rounded">
                          {offer.code}
                        </span>
                      )}
                      <span className="text-sm font-semibold text-gray-800">
                        {offer.discountType === 'flat'
                          ? `₹${offer.value} off`
                          : `${offer.value}% off`}
                      </span>
                    </div>
                    {offer.description && (
                      <p className="text-xs text-gray-500">{offer.description}</p>
                    )}
                    <div className="flex gap-3 text-xs text-gray-400 flex-wrap">
                      {offer.minOrderAmount && <span>Min order: ₹{offer.minOrderAmount}</span>}
                      {offer.maxDiscountAmount && (
                        <span>Max discount: ₹{offer.maxDiscountAmount}</span>
                      )}
                      {offer.usageLimit && <span>Limit: {offer.usageLimit} uses</span>}
                      {offer.validUntil && (
                        <span>Expires: {new Date(offer.validUntil).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Switch
                      checked={!!offer.isActive}
                      onCheckedChange={() => toggleOfferActive(index)}
                    />
                    <button type="button" onClick={() => removeOffer(index)}>
                      <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add offer form */}
          {showOfferForm && (
            <div className="border border-dashed border-gray-300 rounded-xl p-5 space-y-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type */}
                <div className="space-y-1">
                  <Label className="text-sm">Offer Type</Label>
                  <Select
                    value={offerDraft.type}
                    onValueChange={val => setOfferDraft(d => ({ ...d, type: val as OfferType }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(['coupon', 'discount', 'referral', 'flash'] as OfferType[]).map(t => (
                        <SelectItem key={t} value={t} className="capitalize">
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Discount type */}
                <div className="space-y-1">
                  <Label className="text-sm">Discount Type</Label>
                  <Select
                    value={offerDraft.discountType}
                    onValueChange={val =>
                      setOfferDraft(d => ({ ...d, discountType: val as DiscountType }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="flat">Flat (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Value */}
                <div className="space-y-1">
                  <Label className="text-sm">
                    Discount Value ({offerDraft.discountType === 'flat' ? '₹' : '%'})
                  </Label>
                  <Input
                    type="number"
                    placeholder={offerDraft.discountType === 'flat' ? '500' : '10'}
                    value={offerDraft.value}
                    onChange={e =>
                      setOfferDraft(d => ({
                        ...d,
                        value: e.target.value === '' ? '' : Number(e.target.value),
                      }))
                    }
                  />
                </div>

                {/* Code */}
                <div className="space-y-1">
                  <Label className="text-sm">Coupon Code (optional)</Label>
                  <Input
                    placeholder="e.g. LAUNCH50"
                    value={offerDraft.code}
                    onChange={e =>
                      setOfferDraft(d => ({ ...d, code: e.target.value.toUpperCase() }))
                    }
                  />
                </div>

                {/* Description */}
                <div className="space-y-1 md:col-span-2">
                  <Label className="text-sm">Description (optional)</Label>
                  <Input
                    placeholder="e.g. Early bird discount"
                    value={offerDraft.description}
                    onChange={e => setOfferDraft(d => ({ ...d, description: e.target.value }))}
                  />
                </div>

                {/* Min order */}
                <div className="space-y-1">
                  <Label className="text-sm">Min Order Amount ₹ (optional)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 1000"
                    value={offerDraft.minOrderAmount}
                    onChange={e =>
                      setOfferDraft(d => ({
                        ...d,
                        minOrderAmount: e.target.value === '' ? '' : Number(e.target.value),
                      }))
                    }
                  />
                </div>

                {/* Max discount (for percentage type) */}
                {offerDraft.discountType === 'percentage' && (
                  <div className="space-y-1">
                    <Label className="text-sm">Max Discount Cap ₹ (optional)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 2000"
                      value={offerDraft.maxDiscountAmount}
                      onChange={e =>
                        setOfferDraft(d => ({
                          ...d,
                          maxDiscountAmount: e.target.value === '' ? '' : Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                )}

                {/* Usage limit */}
                <div className="space-y-1">
                  <Label className="text-sm">Usage Limit (optional)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 100"
                    value={offerDraft.usageLimit}
                    onChange={e =>
                      setOfferDraft(d => ({
                        ...d,
                        usageLimit: e.target.value === '' ? '' : Number(e.target.value),
                      }))
                    }
                  />
                </div>

                {/* Valid from */}
                <div className="space-y-1">
                  <Label className="text-sm">Valid From (optional)</Label>
                  <Input
                    type="date"
                    value={offerDraft.validFrom}
                    onChange={e => setOfferDraft(d => ({ ...d, validFrom: e.target.value }))}
                  />
                </div>

                {/* Valid until */}
                <div className="space-y-1">
                  <Label className="text-sm">Valid Until (optional)</Label>
                  <Input
                    type="date"
                    value={offerDraft.validUntil}
                    onChange={e => setOfferDraft(d => ({ ...d, validUntil: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={addOffer}
                  disabled={!offerDraft.value}
                  className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Offer
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Block 3: Partial Payment ──────────────────────────────────────── */}
      {isPaid && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 text-lg flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-purple-500" /> Partial Payment / Installments
            </h3>
            <div className="flex items-center gap-3">
              <Switch
                id="partialAllowed"
                checked={!!partialAllowed}
                onCheckedChange={checked => setValue('partialPayment.isAllowed', checked)}
              />
              <Label htmlFor="partialAllowed" className="text-gray-700">
                Allow installments
              </Label>
            </div>
          </div>

          {partialAllowed && (
            <>
              {/* Existing installments */}
              {installments.length > 0 && (
                <div className="space-y-3">
                  {installments.map((inst, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-purple-50 border border-purple-100 rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-purple-600 bg-purple-100 w-7 h-7 rounded-full flex items-center justify-center">
                          {inst.installmentNumber}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {inst.label || `Installment ${inst.installmentNumber}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            ₹{inst.amount} · Due {new Date(inst.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeInstallment(index)}>
                        <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                      </button>
                    </div>
                  ))}

                  {/* Total vs course price check */}
                  {basePrice > 0 && (
                    <div className="text-xs text-gray-500 flex gap-2 items-center">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      Installment total: ₹
                      {installments.reduce((sum, i) => sum + Number(i.amount), 0).toFixed(2)}
                      {' / '}Course price: ₹{totalPrice.toFixed(2)}
                    </div>
                  )}
                </div>
              )}

              {/* Add installment row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 border border-dashed border-purple-200 rounded-xl p-4 bg-purple-50">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Label (optional)</Label>
                  <Input
                    placeholder="e.g. Registration Fee"
                    value={installmentDraft.label}
                    onChange={e => setInstallmentDraft(d => ({ ...d, label: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Amount (₹)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 5000"
                    value={installmentDraft.amount}
                    onChange={e =>
                      setInstallmentDraft(d => ({
                        ...d,
                        amount: e.target.value === '' ? '' : Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Due Date</Label>
                  <Input
                    type="date"
                    value={installmentDraft.dueDate}
                    onChange={e => setInstallmentDraft(d => ({ ...d, dueDate: e.target.value }))}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={addInstallment}
                    disabled={!installmentDraft.amount || !installmentDraft.dueDate}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
