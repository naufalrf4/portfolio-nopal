import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ICON_OPTIONS } from '../constants/links.constants';
import { getIconData } from '../utils/links.utils';

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
  labelText?: string;
  urlValue?: string;
}

export function IconSelector({ value, onChange, labelText, urlValue }: IconSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="icon">Platform Icon</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a platform icon" />
        </SelectTrigger>
        <SelectContent>
          {ICON_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${option.color}20` }}
                  >
                    <Icon className="h-4 w-4" style={{ color: option.color }} />
                  </div>
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <p className="text-xs text-[#6B7280]">
        Choose a platform icon or leave empty for custom links
      </p>

      {value && (
        <div
          className="flex items-center gap-4 p-4 rounded-2xl"
          style={{
            boxShadow:
              'inset 6px 6px 10px rgba(163,177,198,0.6), inset -6px -6px 10px rgba(255,255,255,0.5)',
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${getIconData(value).color} 0%, ${getIconData(value).color}CC 100%)`,
              boxShadow:
                '5px 5px 10px rgba(163,177,198,0.6), -5px -5px 10px rgba(255,255,255,0.5)',
            }}
          >
            {(() => {
              const { icon: Icon } = getIconData(value);
              return <Icon className="h-6 w-6 text-white" />;
            })()}
          </div>
          <div>
            <p className="font-medium text-[#3D4852]">{labelText || 'Link Label'}</p>
            <p className="text-sm text-[#6B7280] truncate max-w-[200px]">
              {urlValue || 'https://...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
