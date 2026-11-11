import React from 'react';
import { useGameStore } from '@/store/game-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/feedback';
import { BellRing, Calendar, Sparkles } from 'lucide-react';

export function EventHistoryScreen() {
  const { gameState } = useGameStore();

  if (!gameState) return null;

  // Extract all triggered events across history
  const allEvents = gameState.history.reports
    .map((rep) => ({
      turn: rep.turn,
      events: rep.eventsTriggered || [],
      resignations: rep.resignedEmployees || [],
    }))
    .filter((e) => e.events.length > 0 || e.resignations.length > 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-amber-400" />
            <CardTitle>Nhật ký Sự kiện Điều hành & Biến cố Thị trường</CardTitle>
          </div>
          <span className="text-xs text-slate-400">Biên niên sử các tình huống kinh tế và quyết định điều hành</span>
        </CardHeader>
        <CardContent>
          {allEvents.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="Chưa có sự kiện lớn nào được ghi nhận"
              description="Khi doanh nghiệp phát triển, các biến động kinh tế về cung cầu, quan hệ lao động, giá trị thặng dư và cạnh tranh thị trường sẽ được lưu trữ tại đây."
            />
          ) : (
            <div className="space-y-3">
              {allEvents.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-slate-400 font-semibold mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Tháng {item.turn}</span>
                  </div>
                  {item.events.map((ev, eIdx) => (
                    <div key={eIdx} className="text-slate-200">
                      • Sự kiện kinh tế phát sinh: <strong className="text-amber-400">{ev}</strong>
                    </div>
                  ))}
                  {item.resignations.map((res, rIdx) => (
                    <div key={rIdx} className="text-rose-400">
                      • Thôi việc: <strong>{res}</strong> đã rời khỏi công ty do tinh thần lao động quá thấp.
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
