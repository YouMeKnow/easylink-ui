import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../../../../components/common/PageLayout";
import { OfferAnalytics } from "@/features/vibes/offers";

export default function OfferAnalyticsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <PageLayout title="Offer Analytics">
      <div className="container py-4">
        <OfferAnalytics offerId={id} />

        <div className="mt-4 d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
            Back
          </button>
          <button className="btn btn-primary" onClick={() => navigate(`/offers/${id}`)}>
            View offer details
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
