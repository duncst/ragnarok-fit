import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const EQUIPMENT_OPTIONS = [
  'Barbell', 'Dumbbells', 'Kettlebells', 'Resistance Bands', 'Pull-up Bar', 'Cable Machine', 'Leg Press Machine', 'Bodyweight'
];

interface EquipmentSelectorProps {
  selectedEquipment: string[];
  onEquipmentChange: (equipment: string[]) => void;
}

export const EquipmentSelector = ({ selectedEquipment, onEquipmentChange }: EquipmentSelectorProps) => {
  const handleCheckedChange = (checked: boolean | 'indeterminate', equipment: string) => {
    const isChecked = checked === true;
    if (isChecked) {
      onEquipmentChange([...selectedEquipment, equipment]);
    } else {
      onEquipmentChange(selectedEquipment.filter(e => e !== equipment));
    }
  };

  return (
    <div className="space-y-4">
        <div>
            <h3 className="text-lg font-semibold">Available Equipment</h3>
            <p className="text-sm text-muted-foreground">Select your equipment to help the AI generate a suitable workout.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {EQUIPMENT_OPTIONS.map(equipment => (
                <div key={equipment} className="flex items-center space-x-2">
                    <Checkbox
                        id={equipment}
                        checked={selectedEquipment.includes(equipment)}
                        onCheckedChange={(checked) => handleCheckedChange(checked, equipment)}
                    />
                    <Label htmlFor={equipment} className="text-sm font-normal cursor-pointer select-none">{equipment}</Label>
                </div>
            ))}
        </div>
    </div>
  );
};
