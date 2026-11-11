import React, { useState } from 'react';
import { useUIStore } from '@/store/ui-store';
import { useGameStore } from '@/store/game-store';
import { Industry, BusinessModel, FounderTrait, Difficulty } from '@/engine/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Coffee, Shirt, Terminal, AlertCircle } from 'lucide-react';

export function SetupScreen() {
  const { setActiveScreen, addToast } = useUIStore();
  const { initNewGame } = useGameStore();

  const [companyName, setCompanyName] = useState('Khởi Nghiệp Tiên Phong');
  const [industry, setIndustry] = useState<Industry>('coffee');
  const [businessModel, setBusinessModel] = useState<BusinessModel>('d2c');
  const [founderTrait, setFounderTrait] = useState<FounderTrait>('hustler');
  const [difficulty, setDifficulty] = useState<Difficulty>('angel');

  // Validation
  const [errors, setErrors] = useState<{ companyName?: string }>({});

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = companyName.trim();
    if (!trimmed) {
      setErrors({ companyName: 'Vui lòng nhập tên công ty.' });
      return;
    }
    if (trimmed.length < 3) {
      setErrors({ companyName: 'Tên công ty phải có tối thiểu 3 ký tự.' });
      return;
    }

    setErrors({});
    initNewGame(trimmed, industry, businessModel, founderTrait, difficulty);
    addToast({
      type: 'success',
      title: 'Đăng ký thành lập doanh nghiệp thành công!',
      description: `${trimmed} đã chính thức đi vào hoạt động. Bắt đầu Tháng 1.`,
    });
    setActiveScreen('dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveScreen('menu')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Menu chính</span>
        </Button>
        <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
          Khởi tạo doanh nghiệp
        </div>
      </div>

      <form onSubmit={handleLaunch} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Đăng ký tên doanh nghiệp</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Tên pháp nhân công ty</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (errors.companyName) setErrors({});
                }}
                placeholder="Ví dụ: Công ty TNHH Cà Phê Việt"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-lg px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none transition"
              />
              {errors.companyName && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.companyName}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Industry */}
        <Card>
          <CardHeader>
            <CardTitle>2. Lĩnh vực & Ngành nghề kinh doanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'coffee',
                  name: 'Cà phê thủ công',
                  desc: 'Chu chuyển kho nhanh, hàng dễ hỏng, cung ứng ngắn 1 tháng.',
                  icon: Coffee,
                },
                {
                  id: 'apparel',
                  name: 'Thời trang D2C',
                  desc: 'Biên lợi nhuận tốt, chuỗi cung ứng 2-3 tháng, nhạy cảm tiếp thị.',
                  icon: Shirt,
                },
                {
                  id: 'saas',
                  name: 'Phần mềm B2B (SaaS)',
                  desc: 'Không hàng tồn vật chất, quỹ lương lập trình cao, bán chịu Net-30.',
                  icon: Terminal,
                },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = industry === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setIndustry(item.id as Industry)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-slate-100 ring-1 ring-emerald-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon className={isSelected ? 'text-emerald-400' : 'text-slate-400'} />
                        <span className="font-bold text-xs text-slate-200">{item.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Model */}
        <Card>
          <CardHeader>
            <CardTitle>3. Mô hình lưu thông & Tiếp cận thị trường</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setBusinessModel('d2c')}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  businessModel === 'd2c'
                    ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="font-bold text-xs text-slate-200 mb-1">Bán lẻ trực tiếp (D2C)</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Thu tiền mặt tức thì 100% khi bán hàng. Yêu cầu chi phí quảng cáo tiếp cận người tiêu dùng cao hơn.
                </p>
              </div>

              <div
                onClick={() => setBusinessModel('b2b')}
                className={`p-4 rounded-xl border cursor-pointer transition ${
                  businessModel === 'b2b'
                    ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="font-bold text-xs text-slate-200 mb-1">Bán buôn doanh nghiệp (B2B)</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Quy mô đơn hàng lớn nhưng bán chịu Net-30. Cần kỷ luật dòng tiền chặt chẽ để vượt qua độ trễ công nợ.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Founder Trait & Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>4. Thế mạnh người sáng lập</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { id: 'hustler', name: 'Nhạy bén thị trường', perk: '+20% Hiệu quả tiếp thị & Chuyển đổi bán hàng' },
                  { id: 'product_geek', name: 'Chuyên gia sản phẩm', perk: '+15% Uy tín thương hiệu & Kiểm định chất lượng' },
                  { id: 'ops_veteran', name: 'Lão luyện vận hành', perk: '-15% Giá vốn sản xuất & Tăng công suất kho' },
                ].map((f) => (
                  <div
                    key={f.id}
                    onClick={() => setFounderTrait(f.id as FounderTrait)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition text-xs ${
                      founderTrait === f.id
                        ? 'bg-emerald-500/10 border-emerald-500 font-semibold text-slate-100'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-slate-200">{f.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{f.perk}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Nguồn vốn khởi đầu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { id: 'bootstrapped', name: 'Tự lực vốn nhỏ (Khó)', perk: '8.000 ₫ tiền mặt · 0 ₫ nợ ngân hàng' },
                  { id: 'angel', name: 'Vốn hạt giống thiên thần (Bình thường)', perk: '35.000 ₫ tiền mặt · 5.000 ₫ nợ' },
                  { id: 'vc', name: 'Quỹ đầu tư mạo hiểm (Quy mô lớn)', perk: '120.000 ₫ tiền mặt · 20.000 ₫ nợ' },
                ].map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setDifficulty(d.id as Difficulty)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition text-xs ${
                      difficulty === d.id
                        ? 'bg-emerald-500/10 border-emerald-500 font-semibold text-slate-100'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-slate-200">{d.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{d.perk}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Button type="submit" size="lg" variant="primary" className="w-full py-3.5 text-base font-bold">
          Khởi sự kinh doanh & Bắt đầu Tháng 1
        </Button>
      </form>
    </div>
  );
}
