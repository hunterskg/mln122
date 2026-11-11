import React, { useState } from 'react';
import { Industry, BusinessModel, FounderTrait, Difficulty } from '@/engine/types';
import { Rocket, Coffee, Shirt, Terminal } from 'lucide-react';

export function SetupWizard({
  onStart,
}: {
  onStart: (
    name: string,
    industry: Industry,
    businessModel: BusinessModel,
    founderTrait: FounderTrait,
    difficulty: Difficulty
  ) => void;
}) {
  const [name, setName] = useState('Công ty Cổ phần Khởi nghiệp Việt');
  const [industry, setIndustry] = useState<Industry>('coffee');
  const [businessModel, setBusinessModel] = useState<BusinessModel>('d2c');
  const [founderTrait, setFounderTrait] = useState<FounderTrait>('hustler');
  const [difficulty, setDifficulty] = useState<Difficulty>('angel');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(name, industry, businessModel, founderTrait, difficulty);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl my-8">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
        <Rocket className="w-8 h-8 text-emerald-400" />
        <div>
          <h1 className="text-xl font-black text-slate-100 tracking-tight">Startup Life: Khởi sự Doanh nghiệp</h1>
          <p className="text-xs text-slate-400">Thành lập, điều hành và mở rộng quy mô doanh nghiệp theo từng tháng.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company Name */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Tên pháp nhân doanh nghiệp</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">Ngành nghề kinh doanh</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'coffee', label: 'Cà phê thủ công', icon: Coffee },
              { id: 'apparel', label: 'Thời trang D2C', icon: Shirt },
              { id: 'saas', label: 'Phần mềm B2B', icon: Terminal },
            ].map((ind) => (
              <button
                type="button"
                key={ind.id}
                onClick={() => setIndustry(ind.id as Industry)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs transition cursor-pointer ${
                  industry === ind.id
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <ind.icon className="w-5 h-5 mb-1.5" />
                {ind.label}
              </button>
            ))}
          </div>
        </div>

        {/* Business Model */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">Mô hình lưu thông & Doanh thu</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setBusinessModel('d2c')}
              className={`p-3 rounded-lg border text-left text-xs transition cursor-pointer ${
                businessModel === 'd2c'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="font-bold">Bán lẻ trực tiếp (D2C)</div>
              <div className="text-[11px] text-slate-500 mt-1">Thu tiền mặt tức thì, chi phí quảng cáo tiếp cận cao hơn.</div>
            </button>
            <button
              type="button"
              onClick={() => setBusinessModel('b2b')}
              className={`p-3 rounded-lg border text-left text-xs transition cursor-pointer ${
                businessModel === 'b2b'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="font-bold">Bán buôn đại lý (B2B)</div>
              <div className="text-[11px] text-slate-500 mt-1">Bán chịu Net-30, quy mô đơn hàng và hợp đồng lớn hơn.</div>
            </button>
          </div>
        </div>

        {/* Founder Trait */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">Thế mạnh người sáng lập</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'hustler', label: 'Nhạy bén thị trường', desc: '+25% Hiệu quả tiếp thị & Bán hàng' },
              { id: 'product_geek', label: 'Chuyên gia sản phẩm', desc: '+15% Uy tín & Tinh thần đội ngũ' },
              { id: 'ops_veteran', label: 'Lão luyện vận hành', desc: '-15% Chi phí vốn & +Công suất kho' },
            ].map((f) => (
              <button
                type="button"
                key={f.id}
                onClick={() => setFounderTrait(f.id as FounderTrait)}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  founderTrait === f.id
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-bold">{f.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">Nguồn vốn khởi đầu</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'bootstrapped', label: 'Tự lực vốn nhỏ', desc: '8.000 ₫ tiền mặt, 0 ₫ nợ' },
              { id: 'angel', label: 'Nhà đầu tư thiên thần', desc: '35.000 ₫ tiền mặt, 5.000 ₫ nợ' },
              { id: 'vc', label: 'Quỹ mạo hiểm', desc: '120.000 ₫ tiền mặt, 20.000 ₫ nợ' },
            ].map((d) => (
              <button
                type="button"
                key={d.id}
                onClick={() => setDifficulty(d.id as Difficulty)}
                className={`p-2.5 rounded-lg border text-left text-xs transition cursor-pointer ${
                  difficulty === d.id
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-bold">{d.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-lg text-sm transition shadow-lg shadow-emerald-500/20 cursor-pointer"
        >
          Thành lập Doanh nghiệp & Bắt đầu
        </button>
      </form>
    </div>
  );
}
