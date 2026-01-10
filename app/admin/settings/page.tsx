import React from 'react';
import { Card, CardHeader, CardBody, Divider, Switch, Input, Button } from "@heroui/react";

export default function SettingsPage() {
    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-100">Configuración</h1>
                <p className="text-zinc-500">Ajustes generales del sistema y preferencias de la cuenta.</p>
            </div>

            <div className="space-y-6">
                <Card className="bg-zinc-900/40 border border-zinc-800 backdrop-blur-xl">
                    <CardHeader className="flex flex-col items-start px-6 pt-6">
                        <h3 className="text-lg font-bold text-zinc-100">General</h3>
                        <p className="text-sm text-zinc-500">Configuración básica del panel.</p>
                    </CardHeader>
                    <CardBody className="px-6 py-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-zinc-200 font-medium">Notificaciones por correo</p>
                                <p className="text-xs text-zinc-500">Recibir alertas de nuevas citas registradas.</p>
                            </div>
                            <Switch defaultSelected color="warning" />
                        </div>
                        <Divider className="bg-zinc-800" />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-zinc-200 font-medium">Modo mantenimiento</p>
                                <p className="text-xs text-zinc-500">Desactivar temporalmente las reservas públicas.</p>
                            </div>
                            <Switch color="danger" />
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-zinc-900/40 border border-zinc-800 backdrop-blur-xl">
                    <CardHeader className="flex flex-col items-start px-6 pt-6">
                        <h3 className="text-lg font-bold text-zinc-100">Perfil de la Aplicación</h3>
                        <p className="text-sm text-zinc-500">Información visible para los clientes.</p>
                    </CardHeader>
                    <CardBody className="px-6 py-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nombre del Negocio"
                                placeholder="MiagoBarber"
                                variant="bordered"
                                classNames={{ inputWrapper: "border-zinc-800" }}
                            />
                            <Input
                                label="Teléfono de Contacto"
                                placeholder="+507 0000-0000"
                                variant="bordered"
                                classNames={{ inputWrapper: "border-zinc-800" }}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button className="bg-[#D09E1E] text-black font-bold">Guardar Cambios</Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
