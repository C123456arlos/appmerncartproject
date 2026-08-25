import { XIcon } from "lucide-react"

const AddressForm = ({ resetForm, handleSubmit, form, setForm, editingId }: any) => {

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-50"></div>
            <div onClick={resetForm} className="fixed inset-0 z-50 flex-center p-4">
                <form onClick={e => e.stopPropagation()} onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 w-full max-w-lg animate-fade-in">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-semibold text-app-green">{editingId ? 'edit address' : 'add new address'}</h2>
                        <button type="button" onClick={resetForm} className="p-2 hover:bg-app-cream rounded-lg">
                            <XIcon className="size-5"></XIcon>
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-app-green mb-1.5">label</label>
                            <input type="text" placeholder="home work etc" required className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}></input>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-app-green mb-1.5">street address</label>
                            <input type="text" required className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}></input>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-app-green mb-1.5">city</label>
                                <input type="text" required className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}></input>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-app-green mb-1.5">state</label>
                                <input type="text" required className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}></input>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-app-green mb-1.5">zip code</label>
                                <input type="text" required className="w-full px-4 py-2.5 text-sm rounded-xl border border-app-border focus:border-app-green outline-none" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })}></input>
                            </div>
                            <div className="flex items-end pb-1">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}></input>
                                    <span className="text-sm text-app-text">set as default</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="mt-6 w-full py-3 bg-app-green text-white font-semibold rounded-xl hover:bg-app-green-light transition-colors">
                        {editingId ? 'update address' : 'save address'}
                    </button>
                </form>
            </div>
        </>
    )
}

export default AddressForm