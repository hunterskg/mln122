import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, DollarSign, Truck, Users, LineChart, ShieldAlert, GraduationCap, X } from 'lucide-react';

export function TutorialModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <Card className="max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-slate-900 border-slate-700 shadow-2xl">
        <CardHeader className="border-b border-slate-800 pb-3 flex flex-row items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <CardTitle className="text-base text-slate-100 font-black">Cẩm nang Khởi sự Doanh nghiệp & Quy luật Kinh tế</CardTitle>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent className="space-y-4 pt-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-1">
            <div className="font-bold text-emerald-300">Mục tiêu Chiến lược</div>
            <div>
              Dẫn dắt doanh nghiệp phát triển từ số không đến vị thế dẫn đầu thị trường trong 36 tháng vận hành. Tích lũy tư bản, làm chủ quy luật giá trị và bảo đảm dòng tiền thanh khoản an toàn.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-slate-100 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Kế toán dồn tích & Dòng tiền thực tế</span>
              </div>
              <p className="text-slate-400">
                Doanh thu dồn tích ghi nhận khi hàng được giao, nhưng dòng tiền thực tế phụ thuộc mô hình lưu thông. Trong mô hình B2B, 70% giá trị bán hàng bị giam lỏng dưới dạng khoản phải thu Net-30. Cần giám sát chặt chẽ số tháng dự phòng tiền mặt.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-slate-100 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-sky-400" />
                <span>Chuỗi cung ứng & Xuất kho FIFO</span>
              </div>
              <p className="text-slate-400">
                Nhà cung ứng có thời gian vận chuyển (0 đến 2 tháng) và tỷ lệ giao hàng đúng hẹn khác nhau. Hàng xuất kho tuân thủ nguyên tắc FIFO (nhập trước xuất trước). Cháy hàng thiếu cung làm tổn hại uy tín và sự hài lòng của khách hàng.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-slate-100 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Sức lao động & Năng suất (v)</span>
              </div>
              <p className="text-slate-400">
                Lao động vận hành quyết định giới hạn công suất đóng gói và xuất xưởng. Lao động bán hàng mở rộng khách hàng mới. Lao động CSKH giảm tỷ lệ rời bỏ. Ép công nhân tăng ca vượt 125% công suất làm cạn kiệt sức lao động và gây làn sóng thôi việc.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-slate-100 flex items-center gap-1.5">
                <LineChart className="w-4 h-4 text-amber-400" />
                <span>Thị trường, Cung - Cầu & Giá trị</span>
              </div>
              <p className="text-slate-400">
                Cầu thị trường co giãn theo tương quan giữa giá bán của bạn với giá đối thủ. Định giá cao mở rộng biên lợi nhuận nhưng giảm cầu tự nhiên. Chi phí tiếp thị thuộc chi phí lưu thông thuần túy và chịu quy luật lợi suất giảm dần.
              </p>
            </div>
          </div>

          <div className="p-3 bg-indigo-950/20 border border-indigo-600/30 rounded-xl space-y-1">
            <div className="font-bold text-indigo-300 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>50 Tình huống Kinh tế Mác - Lênin</span>
            </div>
            <div className="text-slate-400">
              Mỗi tháng, các tình huống điều hành gắn liền với Giáo trình Kinh tế chính trị Mác - Lênin sẽ phát sinh. Mỗi quyết định đều có tính hai mặt (trade-off) giữa lợi nhuận ngắn hạn, sức lao động và sự phát triển bền vững của tư bản.
            </div>
          </div>

          <div className="p-3 bg-amber-950/20 border border-amber-600/30 rounded-xl space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Khả năng thanh toán & Tự động rút thấu chi</span>
            </div>
            <div>
              Nếu số dư tiền mặt rơi vào âm, ngân hàng sẽ tự động trích vốn vay từ hạn mức tín dụng thấu chi còn lại. Nếu hạn mức cạn kiệt và tiền mặt tiếp tục âm trong 2 tháng liên tiếp, doanh nghiệp sẽ bị tuyên bố phá sản và thanh lý tài sản.
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="md" variant="primary" onClick={onClose} className="w-full sm:w-auto">
              Đã hiểu, Bắt đầu Vận hành Doanh nghiệp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
