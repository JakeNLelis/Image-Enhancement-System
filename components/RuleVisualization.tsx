"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RuleVisualizationProps } from "@/types/fuzzy";

export function RuleVisualization({
  rules,
  maxRulesToShow = 10,
}: RuleVisualizationProps) {
  const activeRules = rules.filter((rule) => rule.isActive);
  const sortedRules = activeRules.sort(
    (a, b) => b.firingStrength - a.firingStrength
  );
  const displayRules = sortedRules.slice(0, maxRulesToShow);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Fuzzy Rules</CardTitle>
        <p className="text-sm text-muted-foreground">
          Showing {displayRules.length} of {activeRules.length} active rules
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayRules.map((rule) => (
            <div key={rule.ruleId} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Rule {rule.ruleId}</Badge>
                  <Badge
                    variant={
                      rule.firingStrength > 0.7
                        ? "default"
                        : rule.firingStrength > 0.4
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {(rule.firingStrength * 100).toFixed(0)}% strength
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">IF </span>
                  {rule.antecedentValues.map((antecedent, index) => (
                    <span key={index}>
                      <span className="text-blue-600">
                        {antecedent.variable}
                      </span>
                      <span> is </span>
                      <Badge variant="outline" className="mx-1">
                        {antecedent.term}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-1">
                        ({(antecedent.membershipValue * 100).toFixed(0)}%)
                      </span>
                      {index < rule.antecedentValues.length - 1 && (
                        <span className="font-medium"> AND </span>
                      )}
                    </span>
                  ))}
                </div>

                <div className="text-sm">
                  <span className="font-medium">THEN </span>
                  {rule.consequentTerms.map((consequent, index) => (
                    <span key={index}>
                      <span className="text-green-600">
                        {consequent.variable}
                      </span>
                      <span> is </span>
                      <Badge variant="secondary" className="mx-1">
                        {consequent.term}
                      </Badge>
                      {index < rule.consequentTerms.length - 1 && (
                        <span className="font-medium"> AND </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Rule Firing Strength</span>
                  <span>{(rule.firingStrength * 100).toFixed(1)}%</span>
                </div>
                <Progress value={rule.firingStrength * 100} className="h-2" />
              </div>

              {rule.description && (
                <p className="text-xs text-muted-foreground italic">
                  {rule.description}
                </p>
              )}
            </div>
          ))}

          {activeRules.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No active rules</p>
            </div>
          )}

          {activeRules.length > maxRulesToShow && (
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                ... and {activeRules.length - maxRulesToShow} more rules
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
