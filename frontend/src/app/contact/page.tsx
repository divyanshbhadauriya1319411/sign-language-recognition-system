'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { TextInput } from '@/components/forms/TextInput';
import { SelectDropdown } from '@/components/forms/SelectDropdown';
import { Textarea } from '@/components/forms/Textarea';
import { Checkbox } from '@/components/forms/Checkbox';
import { Accordion } from '@/components/utility/Accordion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  Stethoscope,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

// Zod validation schema for contact inquiry form
const contactFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must contain at least 2 characters.' }),
  workEmail: z.string().email({ message: 'Please enter a valid work or personal email address.' }),
  companyName: z.string().optional(),
  jobRole: z.string().optional(),
  inquiryCategory: z.enum(['technical_support', 'enterprise_sales', 'nonprofit_grant', 'press_media', 'general_feedback'], {
    errorMap: () => ({ message: 'Please select an inquiry category.' }),
  }),
  urgencyLevel: z.enum(['standard_business', 'high_priority', 'critical_production'], {
    errorMap: () => ({ message: 'Please select an urgency level.' }),
  }),
  message: z
    .string()
    .min(20, { message: 'Please provide at least 20 characters describing your inquiry.' })
    .max(1000, { message: 'Message cannot exceed 1,000 characters.' }),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to our privacy terms before submitting.',
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

/**
 * Public Contact Us Page (`/contact`)
 * Combines support SLA indicators, physical/remote endpoints, and a fully validated
 * react-hook-form + Zod inquiry submission workflow.
 */
export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [ticketReference, setTicketReference] = useState<string>('');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      workEmail: '',
      companyName: '',
      jobRole: '',
      inquiryCategory: 'technical_support',
      urgencyLevel: 'standard_business',
      message: '',
      privacyConsent: false,
    },
  });

  const messageContent = watch('message') || '';

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      // Simulate network submission and ticket generation
      await new Promise((resolve) => setTimeout(resolve, 1400));
      const generatedTicket = `TICKET-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setTicketReference(generatedTicket);
      setSubmissionSuccess(true);
      reset();
    } catch (err) {
      setServerError('An unexpected error occurred while routing your inquiry. Please email us directly at support@signbridge.ai.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqAccordionItems = [
    {
      id: 'contact-faq-1',
      title: 'How fast can I expect a response from technical support or sales?',
      content: (
        <p className="text-slate-300 leading-relaxed text-sm">
          We maintain a guaranteed Service Level Agreement (`SLA`) for all inquiries. Enterprise sales and critical production outages receive a dedicated engineering response within <strong className="text-white">2 business hours</strong>. Standard technical questions and general inquiries are answered within <strong className="text-white">12 to 24 hours</strong>.
        </p>
      ),
    },
    {
      id: 'contact-faq-2',
      title: 'Can I test the sign language recognition engine before talking to sales?',
      content: (
        <p className="text-slate-300 leading-relaxed text-sm">
          Yes! You can instantly test our real-time MediaPipe 3D recognition and natural speech synthesis without signing up. Visit our <Link href="/studio" className="text-indigo-400 font-semibold hover:underline">Live Studio Demo</Link> to experience the system directly from your browser.
        </p>
      ),
    },
    {
      id: 'contact-faq-3',
      title: 'Do you offer custom HIPAA / FERPA compliance agreements for institutions?',
      content: (
        <p className="text-slate-300 leading-relaxed text-sm">
          Absolutely. For hospitals, clinics, universities, and government agencies, our Enterprise tier includes Business Associate Agreements (`BAA`), custom data retention policies, on-premise Kubernetes container deployment options, and isolated VPC endpoints.
        </p>
      ),
    },
    {
      id: 'contact-faq-4',
      title: 'How do I apply for a non-profit or K-12 educational grant?',
      content: (
        <p className="text-slate-300 leading-relaxed text-sm">
          Select <strong className="text-white">&quot;Non-Profit &amp; Educational Grant&quot;</strong> in the inquiry category dropdown above and provide your organization&apos;s registration details. Our community team reviews applications weekly and awards complimentary Pro tier licenses to qualifying accessibility institutions.
        </p>
      ),
    },
  ];

  return (
    <div className="w-full bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* 1. HERO HEADER */}
      <section className="relative pt-16 pb-16 md:pt-24 md:pb-20 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-indigo-600/20 to-teal-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 relative z-10">
          <Badge variant="purple" size="md">Connect With Our Team</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-[1.15]">
            We&apos;re Here to Support Your{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Accessibility Journey
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Whether you need technical guidance, custom vocabulary fine-tuning for your enterprise, or accessibility compliance consultation, our engineering team is ready to assist.
          </p>
        </div>
      </section>

      {/* 2. MAIN CONTACT GRID */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Support Channels & Physical Lab Details */}
            <div className="lg:col-span-5 space-y-8 text-left">
              <div className="space-y-3">
                <Badge variant="success" size="sm">Guaranteed SLA</Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Support Channels &amp; Response Targets
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  We prioritize urgent medical triage, live educational classroom setups, and production system inquiries.
                </p>
              </div>

              {/* SLA Cards */}
              <div className="space-y-4">
                {[
                  {
                    title: 'Technical Support & Diagnostics',
                    target: '2 Business Hours SLA',
                    desc: 'For active API subscribers and WebSocket stream anomalies.',
                    icon: Clock,
                    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
                  },
                  {
                    title: 'Enterprise Custom Deployment',
                    target: 'Dedicated Solution Architect',
                    desc: 'Custom ISL dictionary fine-tuning (`PyTorch`) and on-prem K8s setup.',
                    icon: Building2,
                    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
                  },
                  {
                    title: 'Healthcare & Emergency Triage',
                    target: 'Priority Compliance Routing',
                    desc: 'HIPAA/FERPA data isolation and diagnostic vocabulary checks.',
                    icon: Stethoscope,
                    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card key={item.title} variant="standard" className="p-5 space-y-2 bg-slate-900/60 border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-base font-bold text-white">{item.title}</span>
                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-xs font-mono font-bold text-indigo-400">{item.target}</div>
                      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    </Card>
                  );
                })}
              </div>

              {/* Physical & Remote Details */}
              <Card variant="standard" className="p-6 space-y-4 bg-slate-900 border-slate-800 text-sm">
                <h3 className="font-bold text-white uppercase tracking-wider text-xs font-mono text-slate-400">
                  Global Headquarters &amp; Innovation Labs
                </h3>
                <div className="space-y-3.5 divide-y divide-slate-800/80">
                  <div className="pt-2 flex items-start gap-3 text-slate-300">
                    <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>SignBridge AI Innovation Labs, Electronic City Phase 1, Bengaluru, Karnataka 560100, India</span>
                  </div>
                  <div className="pt-3 flex items-center gap-3 text-slate-300">
                    <Mail className="w-5 h-5 text-purple-400 shrink-0" />
                    <span>enterprise@signbridge.ai (Sales &amp; Partnerships)</span>
                  </div>
                  <div className="pt-3 flex items-center gap-3 text-slate-300">
                    <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>+91 (080) 4567-8900 (Deaf Video Relay Service Available)</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Interactive Zod + React Hook Form */}
            <div className="lg:col-span-7">
              <Card variant="standard" className="p-6 sm:p-8 bg-slate-900/80 border-slate-800 shadow-2xl relative">
                {submissionSuccess ? (
                  <div className="text-center py-12 space-y-6">
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mx-auto shadow-lg">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <Badge variant="success" size="md">Inquiry Received</Badge>
                      <h3 className="text-2xl font-extrabold text-white">Thank You for Contacting Us</h3>
                      <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                        Your message has been securely routed to our technical support and solution architects. A dedicated specialist will follow up with you shortly.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-w-sm mx-auto font-mono text-xs space-y-1">
                      <div className="text-slate-500">YOUR TRACKING REFERENCE:</div>
                      <div className="text-emerald-400 font-bold text-base">{ticketReference}</div>
                    </div>
                    <div className="pt-4 flex justify-center gap-4">
                      <Button variant="outline" size="md" onClick={() => setSubmissionSuccess(false)}>
                        Send Another Inquiry
                      </Button>
                      <Link href="/studio">
                        <Button variant="primary" size="md" icon={<Sparkles className="w-4 h-4" />}>
                          Return to Live Studio
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
                    <div className="border-b border-slate-800 pb-4">
                      <h3 className="text-xl font-extrabold text-white">Send Us a Direct Message</h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Fill out the details below. Required fields are marked and checked against strict validation guidelines.
                      </p>
                    </div>

                    {serverError && (
                      <AlertBanner type="error" title="Submission Error">
                        {serverError}
                      </AlertBanner>
                    )}

                    {/* Row 1: Full Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TextInput
                        label="Full Name *"
                        placeholder="e.g. Dr. Neerja Krishnan"
                        error={errors.fullName?.message}
                        {...register('fullName')}
                      />
                      <TextInput
                        label="Work or Personal Email *"
                        type="email"
                        placeholder="neerja@hospital.org"
                        error={errors.workEmail?.message}
                        {...register('workEmail')}
                      />
                    </div>

                    {/* Row 2: Company & Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TextInput
                        label="Organization / School (Optional)"
                        placeholder="e.g. AIIMS Delhi / Delhi University"
                        {...register('companyName')}
                      />
                      <TextInput
                        label="Job Role or Title (Optional)"
                        placeholder="e.g. Chief Medical Officer / Educator"
                        {...register('jobRole')}
                      />
                    </div>

                    {/* Row 3: Category & Urgency */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <SelectDropdown
                        label="Inquiry Category *"
                        error={errors.inquiryCategory?.message}
                        options={[
                          { value: 'technical_support', label: 'Technical Support & Studio Diagnostics' },
                          { value: 'enterprise_sales', label: 'Enterprise Custom Vocabulary & Sales' },
                          { value: 'nonprofit_grant', label: 'Non-Profit & Educational Institution Grant' },
                          { value: 'press_media', label: 'Press, Media & Research Collaboration' },
                          { value: 'general_feedback', label: 'General Feedback or Accessibility Note' },
                        ]}
                        {...register('inquiryCategory')}
                      />
                      <SelectDropdown
                        label="Urgency Level *"
                        error={errors.urgencyLevel?.message}
                        options={[
                          { value: 'standard_business', label: 'Standard (Response within 12-24 hours)' },
                          { value: 'high_priority', label: 'High Priority (Business Impact / Grant inquiry)' },
                          { value: 'critical_production', label: 'Critical Outage / Emergency Medical Triage (2 Hour SLA)' },
                        ]}
                        {...register('urgencyLevel')}
                      />
                    </div>

                    {/* Row 4: Message */}
                    <Textarea
                      label="Detailed Inquiry Description *"
                      placeholder="Please describe your technical environment, target use case, or specific sign language vocabulary requirements..."
                      maxLength={1000}
                      showCharacterCount
                      value={messageContent}
                      error={errors.message?.message}
                      {...register('message')}
                    />

                    {/* Row 5: Consent Checkbox */}
                    <Checkbox
                      label="I agree to SignBridge AI's privacy terms and authorize data processing for support."
                      helperText="We never share your contact details with third-party advertisers or external agencies."
                      {...register('privacyConsent')}
                    />
                    {errors.privacyConsent && (
                      <p className="text-caption text-error-base font-medium flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {errors.privacyConsent.message}
                      </p>
                    )}

                    {/* Submit Button */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="gradient"
                        size="lg"
                        isLoading={isSubmitting}
                        disabled={isSubmitting}
                        icon={<Send className="w-4 h-4" />}
                        className="w-full sm:w-auto shadow-lg shadow-indigo-500/25"
                      >
                        {isSubmitting ? 'Routing Inquiry...' : 'Submit Contact Inquiry'}
                      </Button>
                    </div>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRE-SUBMISSION FAQ ACCORDION */}
      <section className="py-20 bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <Badge variant="info" size="md">Quick Answers</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Support Questions
            </h2>
            <p className="text-sm text-slate-400">
              Find immediate clarification on our SLAs, compliance protocols, and testing tiers.
            </p>
          </div>

          <Accordion items={faqAccordionItems} allowMultiple className="text-left" />
        </div>
      </section>
    </div>
  );
}
