"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../components/ui/dialog";
import { Button } from "../components/ui/button";

export default function PasswordChangeModal({ open, onOpenChange, onSubmit, loading }) {
  const [form, setForm] = useState({ old: "", new1: "", new2: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form, () => setForm({ old: "", new1: "", new2: "" }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Changer mon mot de passe</DialogTitle>
            <DialogDescription>Veuillez saisir votre ancien et nouveau mot de passe.</DialogDescription>
          </DialogHeader>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ancien mot de passe</label>
            <input type="password" name="old" value={form.old} onChange={handleChange} required minLength={6} className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={loading} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <input type="password" name="new1" value={form.new1} onChange={handleChange} required minLength={6} className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={loading} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
            <input type="password" name="new2" value={form.new2} onChange={handleChange} required minLength={6} className="w-full px-3 py-2 border border-gray-300 rounded-md" disabled={loading} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !form.old || !form.new1 || !form.new2}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">Annuler</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
