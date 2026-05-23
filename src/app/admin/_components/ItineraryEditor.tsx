"use client";

import { useState }           from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical, Plus, Pencil, Trash2, Check, X }     from "lucide-react";

export interface ItineraryDay {
  day:         number;
  title:       string;
  description: string;
}

interface ItineraryEditorProps {
  value:    ItineraryDay[];
  onChange: (days: ItineraryDay[]) => void;
}

export function ItineraryEditor({ value, onChange }: ItineraryEditorProps) {
  const [editingIdx, setEditingIdx]   = useState<number | null>(null);
  const [editTitle,  setEditTitle]    = useState("");
  const [editDesc,   setEditDesc]     = useState("");

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(value);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    onChange(items.map((item, i) => ({ ...item, day: i + 1 })));
  };

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditTitle(value[idx].title);
    setEditDesc(value[idx].description);
  };

  const saveEdit = () => {
    if (editingIdx === null) return;
    const updated = [...value];
    updated[editingIdx] = { ...updated[editingIdx], title: editTitle, description: editDesc };
    onChange(updated);
    setEditingIdx(null);
  };

  const remove = (idx: number) => {
    const updated = value.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 }));
    onChange(updated);
  };

  const addDay = () => {
    const newDay: ItineraryDay = { day: value.length + 1, title: "New Day", description: "" };
    onChange([...value, newDay]);
    setEditingIdx(value.length);
    setEditTitle(newDay.title);
    setEditDesc(newDay.description);
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="itinerary">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {value.map((day, idx) => (
                <Draggable key={`day-${idx}`} draggableId={`day-${idx}`} index={idx}>
                  {(prov, snap) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      className={`bg-white border rounded-xl transition-shadow ${snap.isDragging ? "shadow-lg border-primary/30" : "border-gray-200"}`}
                    >
                      {editingIdx === idx ? (
                        <div className="p-3 space-y-2">
                          <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full text-sm font-semibold border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Day title"
                          />
                          <textarea
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            rows={3}
                            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            placeholder="Description..."
                          />
                          <div className="flex gap-2">
                            <button type="button" onClick={saveEdit} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg">
                              <Check className="w-3 h-3" /> Save
                            </button>
                            <button type="button" onClick={() => setEditingIdx(null)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                              <X className="w-3 h-3" /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2 px-3 py-2.5">
                          <div {...prov.dragHandleProps} className="mt-0.5 text-gray-300 hover:text-gray-500 cursor-grab">
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-primary">Day {day.day}</p>
                            <p className="text-sm font-medium text-gray-800 truncate">{day.title}</p>
                            {day.description && (
                              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{day.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button type="button" onClick={() => startEdit(idx)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => remove(idx)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button
        type="button"
        onClick={addDay}
        className="mt-3 flex items-center gap-2 px-4 py-2 border border-dashed border-primary/30 text-primary text-sm font-medium rounded-xl hover:bg-primary/5 transition-colors w-full justify-center"
      >
        <Plus className="w-4 h-4" /> Add Day
      </button>
    </div>
  );
}
