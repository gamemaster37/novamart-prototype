import { ShieldCheck } from "lucide-react";
import { PrivacyChecklist } from "../components/PrivacyChecklist";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

export function Privacy() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Privacy and Data Handling</h2>
        <p className="mt-1 text-sm text-slate-600">Demo controls for responsible AI-assisted CRM workflows.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-blue-50 p-3 text-blue-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <CardTitle>Prototype Data Handling Statement</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-6 text-slate-700">
          <p>This university project demo uses mock customer data only. No real NovaMart customer records are included.</p>
          <p>DeepSeek requests are made only by the backend and include only the minimum CRM context needed for the selected recommendation or ticket draft.</p>
          <p>The DeepSeek API key is stored in backend environment variables. The frontend never receives the key and only calls relative `/api` routes.</p>
          <p>The floating guide helper is limited to platform usage questions and uses the same backend-only AI pattern.</p>
          <p>AI-generated support responses are draft suggestions. They are not automatically sent to customers, and tickets are not automatically closed.</p>
          <p>AI recommendations are saved in SQLite as an audit trail. A real deployment would also require authentication, access controls, retention rules, consent management, and privacy compliance review.</p>
        </CardContent>
      </Card>

      <PrivacyChecklist
        items={[
          "Data minimisation",
          "Secure API key handling",
          "Human review of AI responses",
          "AI recommendation audit trail",
          "Mock data only",
          "Backend-only AI calls"
        ]}
      />
    </div>
  );
}
