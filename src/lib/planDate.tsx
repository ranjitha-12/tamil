export interface PlanDateResult {
  planStartDate: Date;
  planEndDate: Date;
  sessionLimit: number;
  paymentDetails: Record<string, any>;
}

export function calculatePlanDates(
  plan: string,
  billingCycle: string,
  sessionType: string,
  selectedPlan: { price: number; name: string },
  startMonth?: number,
  startYear?: number
): PlanDateResult {
  let sessionLimit = 0;
  let planStartDate = new Date();
  let planEndDate = new Date();
  let paymentDetails: any = {};
  let weeklySessions = 0;

  if (sessionType === "1h") weeklySessions = 2;
  else if (sessionType === "30m") weeklySessions = 4;
  else if (sessionType === "40m") weeklySessions = 3;

  if (billingCycle === "monthly") {
    if (startMonth == null || startYear == null) {
      throw new Error("Start month and year are required for monthly billing");
    }

    // next cycle (month)
    planStartDate = new Date(startYear, startMonth, 1, 0, 0, 0, 0);
    planEndDate = new Date(startYear, startMonth + 1, 0, 23, 59, 59, 999);
    sessionLimit = 4 * weeklySessions;

    paymentDetails = {
      monthlyPrice: Number(selectedPlan.price),
      sessions: sessionLimit,
      totalAmount: Number(selectedPlan.price),
      sessionType,
      billingCycle,
      planName: selectedPlan.name,
      planStartDate: planStartDate.toISOString(),
      planEndDate: planEndDate.toISOString(),
    };
  } else if (billingCycle === "yearly") {
    if (startMonth == null || startYear == null) {
      throw new Error("Start month and year are required for yearly billing");
    }

    // yearly cycle: start next month, end same month next year - 1 day
    planStartDate = new Date(startYear, startMonth, 1, 0, 0, 0, 0);
    planEndDate = new Date(startYear + 1, startMonth, 0, 23, 59, 59, 999);
    sessionLimit = 52 * weeklySessions;

    const yearlyPrice = Number(selectedPlan.price) * 11; // 1 month free

    paymentDetails = {
      yearlyPrice,
      sessions: sessionLimit,
      totalAmount: yearlyPrice,
      sessionType,
      billingCycle,
      planName: selectedPlan.name,
      planStartDate: planStartDate.toISOString(),
      planEndDate: planEndDate.toISOString(),
    };
  } else if (billingCycle === "freeTrial" && plan === "freeTrial") {
    sessionLimit = 1;
    planStartDate = new Date();
    planEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    paymentDetails = {
      sessions: sessionLimit,
      sessionType,
      billingCycle,
      planName: selectedPlan.name,
      planStartDate: planStartDate.toISOString(),
      planEndDate: planEndDate.toISOString(),
    };
  }

  return { planStartDate, planEndDate, sessionLimit, paymentDetails };
}