import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Loader2 } from "lucide-react";
import { ChartCard } from "@/components/reports/ChartCard";
import { PieChartComponent } from "@/components/reports/PieChartComponent";
import { BarChartComponent } from "@/components/reports/BarChartComponent";
import { getReportData, exportReportData } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";

export function ReportsPage() {
  const [year, setYear] = useState("2024");
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadReportData();
  }, [year]);

  const loadReportData = async () => {
    setIsLoading(true);
    try {
      const data = await getReportData(year);
      setReportData(data);
    } catch (error) {
      console.error('Error loading report data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load report data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const csvData = await exportReportData(year);
      if (!csvData) {
        throw new Error('No data to export');
      }

      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sedco-entrepreneurs-report-${year}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Report downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download report. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-2">
            Comprehensive analysis of SEDCO entrepreneur data
          </p>
        </div>
        <div className="flex gap-4">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={downloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Gender Distribution"
          description="Distribution of entrepreneurs by gender"
        >
          <PieChartComponent data={reportData?.genderDistribution || []} />
        </ChartCard>

        <ChartCard
          title="Race Distribution"
          description="Distribution of entrepreneurs by race"
        >
          <PieChartComponent data={reportData?.raceDistribution || []} />
        </ChartCard>

        <ChartCard
          title="Monthly Income Distribution"
          description="Income ranges of entrepreneurs"
        >
          <BarChartComponent
            data={reportData?.monthlyIncomeRanges || []}
            xAxisKey="range"
            barKey="count"
            barName="Entrepreneurs"
          />
        </ChartCard>

        <ChartCard
          title="Agency Distribution"
          description="Distribution by supporting agency"
        >
          <PieChartComponent data={reportData?.agencyDistribution || []} />
        </ChartCard>

        <ChartCard
          title="Academic Qualification"
          description="Distribution by academic qualification"
        >
          <PieChartComponent data={reportData?.academicDistribution || []} />
        </ChartCard>

        <ChartCard
          title="Program Distribution"
          description="Distribution by enrolled program"
        >
          <PieChartComponent data={reportData?.programDistribution || []} />
        </ChartCard>

        <ChartCard
          title="Business Type Distribution"
          description="Distribution by business type"
        >
          <PieChartComponent data={reportData?.businessTypeDistribution || []} />
        </ChartCard>

        <ChartCard
          title="District Distribution"
          description="Number of entrepreneurs by district"
        >
          <BarChartComponent
            data={reportData?.districtDistribution || []}
            xAxisKey="district"
            barKey="count"
            barName="Entrepreneurs"
          />
        </ChartCard>
      </div>
    </div>
  );
}