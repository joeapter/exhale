"use client";

import { useState, useEffect, useCallback } from "react";
import { Printer, Plus, Trash2, X } from "lucide-react";
import { formatDate, formatDateRange } from "@/lib/utils";

type PersonData = {
  id: string;
  firstName: string;
  lastName: string;
  roomingPref: string;
  status: string;
  package: { name: string } | null;
};

type RoomData = {
  id: string;
  name: string;
  capacity: number;
  registrations: PersonData[];
};

type RetreatOption = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
};

type Props = {
  retreats: RetreatOption[];
};

const roomingBadge: Record<string, { label: string; color: string }> = {
  WITH_FRIEND: { label: "With friend", color: "rgba(100,100,180,0.8)" },
  SOLO: { label: "Solo", color: "var(--color-clay)" },
};

export default function RoomOrganizerClient({ retreats }: Props) {
  const [selectedRetreatId, setSelectedRetreatId] = useState(retreats[0]?.id ?? "");
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [unassigned, setUnassigned] = useState<PersonData[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);

  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomCapacity, setNewRoomCapacity] = useState("2");
  const [addingRoom, setAddingRoom] = useState(false);

  const selectedRetreat = retreats.find((r) => r.id === selectedRetreatId);

  const fetchData = useCallback(async () => {
    if (!selectedRetreatId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/rooms?retreatId=${selectedRetreatId}`);
      if (res.ok) {
        const data = await res.json();
        setRooms(data.rooms);
        setUnassigned(data.unassigned);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedRetreatId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function findPerson(id: string): PersonData | null {
    for (const room of rooms) {
      const p = room.registrations.find((r) => r.id === id);
      if (p) return p;
    }
    return unassigned.find((p) => p.id === id) ?? null;
  }

  async function assignRoom(personId: string, targetRoomId: string | null) {
    const person = findPerson(personId);
    if (!person) return;

    setRooms((prev) =>
      prev.map((r) => ({
        ...r,
        registrations: r.registrations.filter((p) => p.id !== personId),
      }))
    );
    setUnassigned((prev) => prev.filter((p) => p.id !== personId));

    if (targetRoomId) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === targetRoomId
            ? { ...r, registrations: [...r.registrations, person] }
            : r
        )
      );
    } else {
      setUnassigned((prev) =>
        [...prev, person].sort((a, b) =>
          `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`)
        )
      );
    }

    const res = await fetch(`/api/admin/registrations/${personId}/room`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: targetRoomId }),
    });
    if (!res.ok) fetchData();
  }

  async function addRoom() {
    if (!newRoomName.trim() || !newRoomCapacity || !selectedRetreatId) return;
    setAddingRoom(true);
    try {
      const res = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          retreatId: selectedRetreatId,
          name: newRoomName.trim(),
          capacity: parseInt(newRoomCapacity),
        }),
      });
      if (res.ok) {
        const newRoom = await res.json();
        setRooms((prev) => [
          ...prev,
          { ...newRoom, registrations: newRoom.registrations ?? [] },
        ]);
        setNewRoomName("");
        setNewRoomCapacity("2");
        setShowAddRoom(false);
      }
    } finally {
      setAddingRoom(false);
    }
  }

  async function deleteRoom(roomId: string) {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    if (room.registrations.length > 0) {
      setUnassigned((prev) =>
        [...prev, ...room.registrations].sort((a, b) =>
          `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`)
        )
      );
    }

    const res = await fetch(`/api/admin/rooms/${roomId}`, { method: "DELETE" });
    if (!res.ok) fetchData();
  }

  function handleDragStart(e: React.DragEvent, personId: string) {
    setDraggedId(personId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", personId);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverTarget(null);
  }

  function handleDragOver(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverTarget !== targetId) setDragOverTarget(targetId);
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverTarget(null);
    }
  }

  function handleDrop(e: React.DragEvent, targetRoomId: string | null) {
    e.preventDefault();
    const personId = e.dataTransfer.getData("text/plain") || draggedId;
    setDragOverTarget(null);
    setDraggedId(null);
    if (personId) assignRoom(personId, targetRoomId);
  }

  const assignedCount = rooms.reduce((s, r) => s + r.registrations.length, 0);
  const totalGuests = assignedCount + unassigned.length;

  function capacityColor(occupants: number, capacity: number) {
    if (occupants === 0) return "var(--color-taupe-light)";
    if (occupants < capacity) return "rgba(90,122,90,1)";
    if (occupants === capacity) return "rgba(212,149,106,1)";
    return "rgba(180,100,100,1)";
  }

  function capacityBg(occupants: number, capacity: number) {
    if (occupants === 0) return "transparent";
    if (occupants < capacity) return "rgba(90,122,90,0.09)";
    if (occupants === capacity) return "rgba(212,149,106,0.1)";
    return "rgba(180,100,100,0.1)";
  }

  return (
    <>
      {/* ── Screen view ── */}
      <div className="rooms-screen-root">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontWeight: 300,
                fontSize: "2.25rem",
                color: "var(--color-espresso)",
              }}
            >
              Room Organizer
            </h1>
            {selectedRetreat && (
              <p
                style={{
                  fontFamily: "Jost",
                  fontWeight: 300,
                  fontSize: "0.8125rem",
                  color: "var(--color-taupe-light)",
                  marginTop: "4px",
                }}
              >
                {formatDateRange(selectedRetreat.startDate, selectedRetreat.endDate)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {retreats.length > 1 && (
              <select
                value={selectedRetreatId}
                onChange={(e) => setSelectedRetreatId(e.target.value)}
                style={{
                  fontFamily: "Jost",
                  fontWeight: 300,
                  fontSize: "0.8125rem",
                  color: "var(--color-espresso)",
                  background: "#FAF7F2",
                  border: "1px solid rgba(228,216,201,0.8)",
                  padding: "0.5rem 0.875rem",
                  outline: "none",
                  cursor: "pointer",
                  height: "40px",
                }}
              >
                {retreats.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={() => setShowAddRoom(!showAddRoom)}
              className="inline-flex h-10 items-center gap-2 px-4"
              style={{
                border: "1px solid rgba(184,144,128,0.5)",
                color: "var(--color-espresso)",
                background: showAddRoom ? "rgba(184,144,128,0.08)" : "transparent",
                fontFamily: "Jost",
                fontSize: "0.75rem",
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                cursor: "pointer",
              }}
            >
              <Plus size={14} strokeWidth={1.8} />
              Add Room
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-10 items-center gap-2 px-4"
              style={{
                border: "1px solid rgba(61,46,34,0.72)",
                color: "#FDFAF6",
                background: "var(--color-espresso)",
                fontFamily: "Jost",
                fontSize: "0.75rem",
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                cursor: "pointer",
              }}
            >
              <Printer size={14} strokeWidth={1.8} />
              Print
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Guests", value: totalGuests },
            { label: "Assigned", value: assignedCount },
            { label: "Unassigned", value: unassigned.length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4"
              style={{ background: "#FAF7F2", border: "1px solid rgba(228,216,201,0.8)" }}
            >
              <div className="label-sm text-[#9B8F84] mb-1">{stat.label}</div>
              <div
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontWeight: 300,
                  fontSize: "1.75rem",
                  color: "var(--color-espresso)",
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Add room form */}
        {showAddRoom && (
          <div
            className="mb-6 p-4 flex flex-wrap items-end gap-4"
            style={{ background: "#FAF7F2", border: "1px solid rgba(184,144,128,0.35)" }}
          >
            <div className="flex flex-col gap-1.5">
              <label className="label-sm text-[#9B8F84]">Room Name / Number</label>
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="e.g. Room 101"
                onKeyDown={(e) => e.key === "Enter" && addRoom()}
                autoFocus
                style={{
                  fontFamily: "Jost",
                  fontWeight: 300,
                  fontSize: "0.875rem",
                  color: "var(--color-espresso)",
                  background: "white",
                  border: "1px solid rgba(184,144,128,0.45)",
                  padding: "0.5rem 0.75rem",
                  outline: "none",
                  width: "200px",
                  height: "40px",
                }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label-sm text-[#9B8F84]">Capacity</label>
              <input
                type="number"
                min="1"
                max="20"
                value={newRoomCapacity}
                onChange={(e) => setNewRoomCapacity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addRoom()}
                style={{
                  fontFamily: "Jost",
                  fontWeight: 300,
                  fontSize: "0.875rem",
                  color: "var(--color-espresso)",
                  background: "white",
                  border: "1px solid rgba(184,144,128,0.45)",
                  padding: "0.5rem 0.75rem",
                  outline: "none",
                  width: "90px",
                  height: "40px",
                }}
              />
            </div>
            <button
              type="button"
              onClick={addRoom}
              disabled={addingRoom || !newRoomName.trim()}
              style={{
                fontFamily: "Jost",
                fontSize: "0.75rem",
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#FDFAF6",
                background: "var(--color-espresso)",
                border: "1px solid rgba(61,46,34,0.72)",
                padding: "0 1.25rem",
                cursor: addingRoom || !newRoomName.trim() ? "not-allowed" : "pointer",
                opacity: addingRoom || !newRoomName.trim() ? 0.5 : 1,
                height: "40px",
              }}
            >
              {addingRoom ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddRoom(false);
                setNewRoomName("");
                setNewRoomCapacity("2");
              }}
              style={{
                fontFamily: "Jost",
                fontSize: "0.75rem",
                fontWeight: 300,
                color: "var(--color-taupe-light)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                height: "40px",
                padding: "0 0.5rem",
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {retreats.length === 0 ? (
          <div
            className="p-10 text-center"
            style={{
              fontFamily: "Jost",
              fontWeight: 300,
              fontSize: "0.875rem",
              color: "var(--color-taupe-light)",
              border: "1px solid rgba(228,216,201,0.8)",
              background: "#FAF7F2",
            }}
          >
            No retreats found. Publish a retreat first to organize rooms.
          </div>
        ) : loading ? (
          <div
            className="p-10 text-center"
            style={{
              fontFamily: "Jost",
              fontWeight: 300,
              fontSize: "0.875rem",
              color: "var(--color-taupe-light)",
            }}
          >
            Loading...
          </div>
        ) : (
          <div className="flex gap-5 items-start">
            {/* Unassigned pool */}
            <div
              onDragOver={(e) => handleDragOver(e, "unassigned")}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, null)}
              style={{
                width: "256px",
                flexShrink: 0,
                minHeight: "180px",
                background:
                  dragOverTarget === "unassigned"
                    ? "rgba(184,144,128,0.07)"
                    : "#FAF7F2",
                border:
                  dragOverTarget === "unassigned"
                    ? "1.5px dashed rgba(184,144,128,0.65)"
                    : "1px solid rgba(228,216,201,0.8)",
                transition: "background 0.12s, border-color 0.12s",
              }}
            >
              <div
                className="px-3 py-3"
                style={{ borderBottom: "1px solid rgba(228,216,201,0.7)" }}
              >
                <div className="label-sm text-[#9B8F84]">Unassigned</div>
                <div
                  style={{
                    fontFamily: "Jost",
                    fontWeight: 300,
                    fontSize: "0.75rem",
                    color: "var(--color-taupe-light)",
                    marginTop: "2px",
                  }}
                >
                  {unassigned.length} guest{unassigned.length !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="p-2 flex flex-col gap-1.5">
                {unassigned.length === 0 ? (
                  <div
                    className="py-6 text-center"
                    style={{
                      fontFamily: "Jost",
                      fontWeight: 300,
                      fontSize: "0.8rem",
                      color: "var(--color-taupe-light)",
                    }}
                  >
                    {rooms.length === 0 ? "Add rooms above" : "All guests assigned"}
                  </div>
                ) : (
                  unassigned.map((person) => (
                    <PersonCard
                      key={person.id}
                      person={person}
                      isDragging={draggedId === person.id}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Rooms grid */}
            <div className="flex-1 min-w-0">
              {rooms.length === 0 ? (
                <div
                  className="p-10 text-center"
                  style={{
                    fontFamily: "Jost",
                    fontWeight: 300,
                    fontSize: "0.875rem",
                    color: "var(--color-taupe-light)",
                    border: "1.5px dashed rgba(184,144,128,0.35)",
                    background: "#FAF7F2",
                  }}
                >
                  Click &ldquo;Add Room&rdquo; to create your first room.
                </div>
              ) : (
                <div
                  className="grid gap-4"
                  style={{ gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))" }}
                >
                  {rooms.map((room) => {
                    const occupants = room.registrations.length;
                    const isOver = dragOverTarget === room.id;

                    return (
                      <div
                        key={room.id}
                        onDragOver={(e) => handleDragOver(e, room.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, room.id)}
                        style={{
                          background: isOver ? "rgba(184,144,128,0.06)" : "#FAF7F2",
                          border: isOver
                            ? "1.5px dashed rgba(184,144,128,0.65)"
                            : "1px solid rgba(228,216,201,0.8)",
                          minHeight: "140px",
                          transition: "background 0.12s, border-color 0.12s",
                        }}
                      >
                        {/* Room header */}
                        <div
                          className="flex items-center justify-between px-3 py-2.5"
                          style={{ borderBottom: "1px solid rgba(228,216,201,0.7)" }}
                        >
                          <div>
                            <div
                              style={{
                                fontFamily: "Jost",
                                fontWeight: 400,
                                fontSize: "0.8125rem",
                                color: "var(--color-espresso)",
                              }}
                            >
                              {room.name}
                            </div>
                            <span
                              className="label-sm"
                              style={{
                                color: capacityColor(occupants, room.capacity),
                                background: capacityBg(occupants, room.capacity),
                                padding: "1px 5px",
                                display: "inline-block",
                                marginTop: "3px",
                              }}
                            >
                              {occupants} / {room.capacity}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteRoom(room.id)}
                            title="Delete room"
                            style={{
                              color: "var(--color-taupe-light)",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px",
                              opacity: 0.55,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Trash2 size={13} strokeWidth={1.8} />
                          </button>
                        </div>

                        {/* Occupants */}
                        <div className="p-2 flex flex-col gap-1.5">
                          {room.registrations.length === 0 ? (
                            <div
                              className="py-4 text-center"
                              style={{
                                fontFamily: "Jost",
                                fontWeight: 300,
                                fontSize: "0.75rem",
                                color: "var(--color-taupe-light)",
                              }}
                            >
                              Drop guests here
                            </div>
                          ) : (
                            room.registrations.map((person) => (
                              <PersonCard
                                key={person.id}
                                person={person}
                                isDragging={draggedId === person.id}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onRemove={() => assignRoom(person.id, null)}
                              />
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Print view ── */}
      <div className="rooms-print-root" aria-hidden="true">
        <div className="rooms-print-header">
          <div className="rooms-print-kicker">Exhale · Room Assignments</div>
          <h1>{selectedRetreat?.title ?? "Retreat"}</h1>
          {selectedRetreat && (
            <p className="rooms-print-subtitle">
              {formatDateRange(selectedRetreat.startDate, selectedRetreat.endDate)} &middot; Generated{" "}
              {formatDate(new Date().toISOString())}
            </p>
          )}
        </div>

        <div className="rooms-print-stats">
          <span>{rooms.length} room{rooms.length !== 1 ? "s" : ""}</span>
          <span>{assignedCount} assigned</span>
          {unassigned.length > 0 && <span>{unassigned.length} unassigned</span>}
        </div>

        <div className="rooms-print-grid">
          {rooms.map((room) => (
            <div key={room.id} className="rooms-print-room">
              <div className="rooms-print-room-header">
                <span className="rooms-print-room-name">{room.name}</span>
                <span className="rooms-print-room-cap">
                  {room.registrations.length} / {room.capacity}
                </span>
              </div>
              {room.registrations.length === 0 ? (
                <div className="rooms-print-empty">Empty</div>
              ) : (
                <ol className="rooms-print-list">
                  {room.registrations.map((person, i) => (
                    <li key={person.id}>
                      <span className="rooms-print-num">{i + 1}.</span>
                      <span className="rooms-print-name">
                        {person.firstName} {person.lastName}
                      </span>
                      {person.package && (
                        <span className="rooms-print-pkg">{person.package.name}</span>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>

        {unassigned.length > 0 && (
          <div className="rooms-print-unassigned">
            <div className="rooms-print-unassigned-title">
              Unassigned ({unassigned.length})
            </div>
            <div className="rooms-print-unassigned-list">
              {unassigned.map((person) => (
                <span key={person.id}>
                  {person.firstName} {person.lastName}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function PersonCard({
  person,
  isDragging,
  onDragStart,
  onDragEnd,
  onRemove,
}: {
  person: PersonData;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onRemove?: () => void;
}) {
  const badge = roomingBadge[person.roomingPref];

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, person.id)}
      onDragEnd={onDragEnd}
      style={{
        background: isDragging ? "rgba(228,216,201,0.35)" : "#FDFAF6",
        border: "1px solid rgba(228,216,201,0.85)",
        padding: "6px 8px 6px 10px",
        cursor: "grab",
        opacity: isDragging ? 0.4 : 1,
        transition: "opacity 0.12s, background 0.12s",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        userSelect: "none",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "Jost",
            fontWeight: 400,
            fontSize: "0.8rem",
            color: "var(--color-espresso)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {person.firstName} {person.lastName}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
          {person.package && (
            <span
              style={{
                fontFamily: "Jost",
                fontWeight: 300,
                fontSize: "0.68rem",
                color: "var(--color-taupe-light)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {person.package.name}
            </span>
          )}
          {badge && (
            <span
              className="label-sm"
              style={{
                fontSize: "0.55rem",
                color: badge.color,
                flexShrink: 0,
              }}
            >
              {badge.label}
            </span>
          )}
        </div>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          title="Remove from room"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-taupe-light)",
            padding: "2px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            opacity: 0.7,
          }}
        >
          <X size={11} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
