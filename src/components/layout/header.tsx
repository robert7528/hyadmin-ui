'use client'

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/react'

export function Header() {
  return (
    <Navbar isBordered className="bg-white shadow-sm">
      <NavbarBrand>
        <span className="font-bold text-lg text-primary">HySP Admin</span>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <span className="text-sm text-gray-500">管理者</span>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
