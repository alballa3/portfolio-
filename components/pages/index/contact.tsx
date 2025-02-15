import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useCallback, FormEvent, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { Loader2, Send, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Types
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface APIResponse {
  message: string;
  success: boolean;
}

const INITIAL_FORM_STATE: FormData = {
  name: "",
  email: "",
  subject: "",
  message: ""
};

export default function Contact() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [submitCount, setSubmitCount] = useState<number>(0);
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number | null>(null);

  // Rate limiting check
  const canSubmit = useCallback((): boolean => {
    if (!lastSubmissionTime) return true;
    const timeSinceLastSubmission = Date.now() - lastSubmissionTime;
    return timeSinceLastSubmission > 60000; // 1 minute cooldown
  }, [lastSubmissionTime]);

  const validateForm = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }
    
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.length < 3) {
      newErrors.subject = "Subject must be at least 3 characters long";
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    } else if (formData.message.length > 1000) {
      newErrors.message = "Message must not exceed 1000 characters";
    }

    return newErrors;
  }, [formData]);

  const handleInputChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error when user starts typing
    setErrors(prev => ({
      ...prev,
      [id]: ""
    }));
  }, []);

  const resetForm = useCallback((): void => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setSubmitCount(0);
  }, []);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!canSubmit()) {
      toast.error("Please wait a minute before submitting again");
      return;
    }

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/contactus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: APIResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      toast.success(data.message || "Message sent successfully!");
      resetForm();
      setSubmitCount(prev => prev + 1);
      setLastSubmissionTime(Date.now());
    } catch (error) {
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getCharacterCount = useCallback((): string => {
    const count = formData.message.length;
    const remaining = 1000 - count;
    return `${count}/1000 characters ${remaining < 100 ? `(${remaining} remaining)` : ''}`;
  }, [formData.message]);

  return (
    <section id="contact" className="container space-y-16 py-24 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-poppins font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
          Get in Touch
        </h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          Have a project in mind or want to discuss potential opportunities? I'd
          love to hear from you!
        </p>
      </div>

      {submitCount > 0 && (
        <Alert className="mx-auto max-w-2xl">
          <AlertDescription>
            Thanks for your message! I'll get back to you as soon as possible.
          </AlertDescription>
        </Alert>
      )}

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Contact Form</CardTitle>
          <CardDescription>
            Fill out the form below and I'll get back to you as soon as
            possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? "border-red-500 focus:border-red-500" : ""}
                  disabled={loading}
                  maxLength={50}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "border-red-500 focus:border-red-500" : ""}
                  disabled={loading}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-muted-foreground"
              >
                Subject <span className="text-red-500">*</span>
              </label>
              <Input
                id="subject"
                placeholder="What's this about?"
                value={formData.subject}
                onChange={handleInputChange}
                className={errors.subject ? "border-red-500 focus:border-red-500" : ""}
                disabled={loading}
                maxLength={100}
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? "subject-error" : undefined}
              />
              {errors.subject && (
                <p id="subject-error" className="text-sm text-red-500">{errors.subject}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-muted-foreground"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="message"
                placeholder="Your message here..."
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                className={errors.message ? "border-red-500 focus:border-red-500" : ""}
                disabled={loading}
                maxLength={1000}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              <div className="flex justify-between items-center">
                {errors.message ? (
                  <p id="message-error" className="text-sm text-red-500">{errors.message}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">{getCharacterCount()}</p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button 
            className="flex-1"
            disabled={loading}
            onClick={handleSubmit}
            type="submit"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={resetForm}
            disabled={loading}
            type="button"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}