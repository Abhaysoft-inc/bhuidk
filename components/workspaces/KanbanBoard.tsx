"use client";

import React, { useState } from "react";
import { 
  DndContext, 
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { 
  SortableContext, 
  arrayMove, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, MessageSquare, Clock, Plus, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

// --- Types ---
type Task = { id: string; title: string; tag: string; comments: number; dueDate: string; assigneeInitial: string };
type ColumnType = { id: string; title: string };

const initialData: Record<string, Task[]> = {
  todo: [
    { id: "t1", title: "Review satellite imagery for unauthorized construction in Sector 4", tag: "Analysis", comments: 3, dueDate: "Tomorrow", assigneeInitial: "A" },
    { id: "t2", title: "Compile local zoning dispute cases from 2023", tag: "Research", comments: 0, dueDate: "In 3 days", assigneeInitial: "R" },
  ],
  inProgress: [
    { id: "t3", title: "Cross-reference ULPIN with historical Cadastral Maps", tag: "Data Sync", comments: 5, dueDate: "Today", assigneeInitial: "M" },
  ],
  review: [
    { id: "t4", title: "Draft policy impact simulation report", tag: "Documentation", comments: 12, dueDate: "Overdue", assigneeInitial: "S" },
  ],
  done: [
    { id: "t5", title: "Setup initial pilot workspace environment", tag: "System", comments: 1, dueDate: "Done", assigneeInitial: "A" },
  ]
};

const columns: ColumnType[] = [
  { id: "todo", title: "To Do" },
  { id: "inProgress", title: "In Progress" },
  { id: "review", title: "In Review" },
  { id: "done", title: "Completed" },
];

// --- Sortable Item Component ---
function SortableTaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "Analysis": return "bg-blue-100 text-blue-800";
      case "Research": return "bg-purple-100 text-purple-800";
      case "Data Sync": return "bg-emerald-100 text-emerald-800";
      case "Documentation": return "bg-amber-100 text-amber-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm hover:shadow group cursor-grab active:cursor-grabbing relative"
    >
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute top-3 right-2 text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className="flex gap-2 items-center mb-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getTagColor(task.tag)}`}>
          {task.tag}
        </span>
      </div>
      
      <p className="text-sm font-semibold text-slate-800 leading-snug mb-4 pr-6">
        {task.title}
      </p>
      
      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1" title="Comments">
            <MessageSquare className="w-3.5 h-3.5" /> {task.comments}
          </span>
          <span className={`flex items-center gap-1 ${task.dueDate === 'Overdue' ? 'text-red-500 font-bold' : ''}`}>
            <Clock className="w-3.5 h-3.5" /> {task.dueDate}
          </span>
        </div>
        <div className="w-6 h-6 rounded-full bg-[#0b2b50] text-white flex items-center justify-center font-bold text-[10px]">
          {task.assigneeInitial}
        </div>
      </div>
    </div>
  );
}

// --- Main Board Component ---
export default function KanbanBoard() {
  const [items, setItems] = useState(initialData);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainer = (id: string) => {
    if (id in items) return id;
    return Object.keys(items).find((key) => items[key].find((item) => item.id === id));
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.findIndex((t) => t.id === active.id);
      const overIndex = overItems.findIndex((t) => t.id === over.id);

      let newIndex;
      if (over.id in prev) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [...prev[activeContainer].filter((item) => item.id !== active.id)],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          activeItems[activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer || activeContainer !== overContainer) {
      setActiveId(null);
      return;
    }

    const activeIndex = items[activeContainer].findIndex((t) => t.id === active.id);
    const overIndex = items[overContainer].findIndex((t) => t.id === over.id);

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
      }));
    }

    setActiveId(null);
  };

  const getActiveTask = () => {
    if (!activeId) return null;
    for (const key of Object.keys(items)) {
      const t = items[key].find(t => t.id === activeId);
      if (t) return t;
    }
    return null;
  };

  return (
    <div className="w-full h-full pb-8 overflow-x-auto">
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-start gap-6 min-w-max">
          {columns.map((col) => (
            <div key={col.id} className="w-80 flex flex-col bg-slate-50/50 rounded-xl border border-slate-200 h-full max-h-[70vh]">
              {/* Column Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-slate-50/95 backdrop-blur z-10 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800">{col.title}</h3>
                  <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {items[col.id]?.length || 0}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-700 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Column Body */}
              <div className="p-3 flex-1 overflow-y-auto min-h-[150px]">
                <SortableContext 
                  id={col.id}
                  items={items[col.id]?.map(t => t.id) || []}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {items[col.id]?.map((task) => (
                      <SortableTaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            </div>
          ))}
        </div>

        {/* Drag Overlay (Shows while dragging) */}
        <DragOverlay>
          {activeId ? <SortableTaskCard task={getActiveTask()!} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
