import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Scale } from "lucide-react";

export default function TermsOfServiceModal({ isOpen, onClose, onAccept }) {
  const [agreed, setAgreed] = useState(false);

  const handleAccept = () => {
    if (agreed) {
      onAccept();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-slate-900 border-slate-800 text-white max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-white">Terms of Service Agreement</DialogTitle>
              <DialogDescription className="text-slate-400">
                Please read carefully before proceeding
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6 text-slate-300">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">
                <strong>LEGAL NOTICE:</strong> Unauthorized recording, distribution, or sharing of course content will result in immediate legal action and prosecution to the fullest extent of the law.
              </p>
            </div>

            <section>
              <h3 className="text-lg font-bold text-white mb-3">1. License Grant and Restrictions</h3>
              <p className="mb-3">
                By purchasing and accessing this course, you are granted a personal, non-transferable, non-exclusive license to view the course materials solely for your individual use. This license explicitly prohibits:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Recording, screen capturing, or reproducing any video content</li>
                <li>Sharing login credentials or account access with any third party</li>
                <li>Distributing, selling, or transferring course materials in any format</li>
                <li>Publishing, uploading, or sharing course content on any platform</li>
                <li>Creating derivative works from the course materials</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-3">2. Intellectual Property Rights</h3>
              <p>
                All course content, including but not limited to videos, images, text, graphics, PSD files, and teaching materials, are proprietary and protected by United States and international copyright laws. All rights, title, and interest in the course materials remain exclusively with the content creator.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-3">3. Content Protection and Watermarking</h3>
              <p>
                All video content is protected with dynamic watermarking technology that embeds your unique account information. This watermark cannot be removed and serves as evidence of unauthorized distribution. Any attempt to circumvent, disable, or remove these protection measures constitutes a violation of this agreement and applicable law.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-3">4. Legal Consequences of Violation</h3>
              <p className="mb-3 font-semibold text-white">
                Violation of these terms will result in immediate legal action, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Civil Lawsuit:</strong> You will be sued for copyright infringement and breach of contract</li>
                <li><strong>Statutory Damages:</strong> Minimum $10,000 per violation, up to $150,000 for willful infringement</li>
                <li><strong>Actual Damages:</strong> All profits and financial harm caused by your violation</li>
                <li><strong>Legal Fees:</strong> You will be liable for all attorney fees and court costs</li>
                <li><strong>Injunctive Relief:</strong> Immediate cease and desist orders</li>
                <li><strong>Criminal Prosecution:</strong> Potential criminal charges under the Digital Millennium Copyright Act (DMCA)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-3">5. Account Termination</h3>
              <p>
                We reserve the right to immediately terminate your access without refund if you violate any terms of this agreement. Termination does not waive our right to pursue legal action for damages incurred.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-3">6. Monitoring and Enforcement</h3>
              <p>
                We actively monitor for unauthorized distribution of course materials across the internet. Our watermarking system allows us to trace any leaked content directly to the source account, providing irrefutable evidence for legal proceedings.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-3">7. Refund Policy</h3>
              <p>
                All sales are final. No refunds will be provided after course access has been granted.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-3">8. Governing Law and Jurisdiction</h3>
              <p>
                This agreement shall be governed by the laws of the United States and the state jurisdiction of the content creator. By accepting these terms, you consent to the exclusive jurisdiction of these courts for any disputes arising from this agreement.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-3">9. Severability</h3>
              <p>
                If any provision of this agreement is found to be unenforceable, the remaining provisions shall remain in full force and effect.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-bold text-white mb-3">10. Acknowledgment</h3>
              <p>
                By clicking "I Accept," you acknowledge that you have read, understood, and agree to be legally bound by all terms and conditions set forth in this agreement. You acknowledge that violation of these terms will result in severe legal and financial consequences.
              </p>
            </section>
          </div>
        </ScrollArea>

        <div className="border-t border-slate-800 pt-4 space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={setAgreed}
              className="mt-1 border-slate-600 data-[state=checked]:bg-blue-600"
            />
            <label htmlFor="terms" className="text-sm text-slate-300 cursor-pointer leading-relaxed">
              I have read and agree to the Terms of Service. I understand that unauthorized recording, distribution, or sharing of course content will result in legal action and I may be sued for damages.
            </label>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAccept}
              disabled={!agreed}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              I Accept - Continue to Purchase
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}