import { Shield, CheckCircle } from 'lucide-react';

export default function ReviewPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-buzz-teal p-2">
            <Shield size={20} className="text-white" />
          </div>
          <h1 className="text-buzz-navy font-display text-3xl font-bold">Review Policy &amp; Disclosure</h1>
        </div>
        <div className="vw-divider w-24 mb-4" />
        <p className="text-xs text-gray-500 font-mono-retro">Last updated: April 2026</p>
      </div>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-buzz-navy font-display font-bold text-lg mb-3 border-b-2 border-buzz-orange pb-2">
            Product Selection
          </h2>
          <p className="mb-3">
            We choose products to review based on relevance to the ID. Buzz camping and overland community. 
            We prioritize products we would buy (or have already bought) for our own build.
          </p>
          <p>
            We decline products that are outside our niche, products we have ethical objections to, 
            and products from brands with a demonstrated pattern of suppressing critical reviews.
          </p>
        </section>

        <section>
          <h2 className="text-buzz-navy font-display font-bold text-lg mb-3 border-b-2 border-buzz-orange pb-2">
            How We Receive Products
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 border-2 border-green-500">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-green-800 text-sm mb-1">Purchased Independently</p>
                <p className="text-sm text-green-900">Most products on this site are purchased with our own money at full retail price. These reviews are marked with no disclosure badge.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border-2 border-yellow-400">
              <CheckCircle size={16} className="text-yellow-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-yellow-900 text-sm mb-1">Vendor-Provided Samples</p>
                <p className="text-sm text-yellow-900">
                  When a vendor provides a product at no cost for review, every post featuring that product 
                  carries a visible &ldquo;Vendor Sample&rdquo; disclosure badge at the top and bottom of the post. 
                  This is required under FTC guidelines and we consider it a basic obligation to our readers.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-buzz-navy font-display font-bold text-lg mb-3 border-b-2 border-buzz-orange pb-2">
            Editorial Independence
          </h2>
          <p className="mb-3">
            We retain full editorial control over all reviews, regardless of how a product was sourced. 
            Vendors do not review, approve, or modify our content before publication.
          </p>
          <p>
            We do not accept payment for favorable reviews. We do not alter published reviews based on 
            vendor feedback after publication unless correcting a factual error.
          </p>
        </section>

        <section>
          <h2 className="text-buzz-navy font-display font-bold text-lg mb-3 border-b-2 border-buzz-orange pb-2">
            Negative Findings
          </h2>
          <p>
            We publish negative findings. Every review includes a &ldquo;What Didn&apos;t Work&rdquo; section. 
            If a vendor-provided product fails significantly, we publish that finding with the same 
            prominence as positive findings. We may notify the vendor before publication if the failure 
            appears to be a manufacturing defect, but the review is published regardless of their response.
          </p>
        </section>

        <section>
          <h2 className="text-buzz-navy font-display font-bold text-lg mb-3 border-b-2 border-buzz-orange pb-2">
            Affiliate Links
          </h2>
          <p>
            Some links on this site may be affiliate links. If you purchase through an affiliate link, 
            we may earn a small commission at no additional cost to you. Affiliate relationships do not 
            influence which products we choose to review or our findings. Affiliate links are not used 
            on vendor-sample reviews.
          </p>
        </section>

        <section>
          <h2 className="text-buzz-navy font-display font-bold text-lg mb-3 border-b-2 border-buzz-orange pb-2">
            What Happens to Samples
          </h2>
          <p>
            Unless a return is requested by the vendor, review samples remain in use and are included in 
            long-term durability follow-ups where applicable. We do not sell review samples.
          </p>
        </section>

        <div className="bg-buzz-cream border-2 border-buzz-navy p-5 mt-6">
          <p className="text-sm text-buzz-navy">
            Questions about this policy? Email us at{' '}
            <a href="mailto:paul@thebuzzcamper.com" className="text-buzz-orange underline">
              paul@thebuzzcamper.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
