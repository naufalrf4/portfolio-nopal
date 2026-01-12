import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GripVertical, Pencil, Trash2, ExternalLink } from 'lucide-react';
import type { ProfileLink } from '../types/links.types';
import { getIconData } from '../utils/links.utils';

interface LinkTableProps {
  links: ProfileLink[];
  onEdit: (link: ProfileLink) => void;
  onDelete: (link: ProfileLink) => void;
  onToggleVisibility: (link: ProfileLink) => void;
}

export function LinkTable({ links, onEdit, onDelete, onToggleVisibility }: LinkTableProps) {
  return (
    <div
      className="rounded-[32px] bg-[#E0E5EC] overflow-hidden"
      style={{
        boxShadow: '9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)',
      }}
    >
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#6B7280]/10">
            <TableHead className="w-10 text-[#6B7280]">
              <GripVertical className="h-4 w-4" />
            </TableHead>
            <TableHead className="text-[#6B7280] font-medium">Platform</TableHead>
            <TableHead className="text-[#6B7280] font-medium">Label</TableHead>
            <TableHead className="text-[#6B7280] font-medium">URL</TableHead>
            <TableHead className="text-[#6B7280] font-medium text-center">Visible</TableHead>
            <TableHead className="text-[#6B7280] font-medium text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => {
            const { icon: IconComponent, color } = getIconData(link.icon);
            return (
              <TableRow
                key={link.id}
                className="border-b border-[#6B7280]/10 hover:bg-[#E0E5EC]/50 transition-colors"
              >
                <TableCell>
                  <GripVertical className="h-4 w-4 text-[#6B7280]/50 cursor-grab" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
                        boxShadow:
                          '3px 3px 6px rgba(163,177,198,0.6), -3px -3px 6px rgba(255,255,255,0.5)',
                      }}
                    >
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {link.icon || 'custom'}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium text-[#3D4852]">{link.label}</p>
                </TableCell>
                <TableCell>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#6B7280] hover:text-[#3B82F6] flex items-center gap-1 max-w-[200px] truncate"
                  >
                    {link.url}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={link.visible}
                    onCheckedChange={() => onToggleVisibility(link)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon-sm" onClick={() => onEdit(link)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onDelete(link)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
