'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react'
import { Plus, Trash2 } from 'lucide-react'
import { adminFeaturesApi, adminPermissionsApi } from '@/lib/api'
import type { Feature } from '@/types/feature'
import type { Permission } from '@/types/permission'

const STANDARD_SUFFIXES = [
  { suffix: 'view', label: '頁面存取', type: 'menu' },
  { suffix: 'create', label: '新增', type: 'button' },
  { suffix: 'update', label: '編輯', type: 'button' },
  { suffix: 'delete', label: '刪除', type: 'button' },
  { suffix: 'export', label: '匯出', type: 'button' },
]

export default function FeaturePermissionsPage() {
  const { id } = useParams<{ id: string }>()
  const [feature, setFeature] = useState<Feature | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSuffixes, setSelectedSuffixes] = useState<Set<string>>(new Set(['view']))
  const [batching, setBatching] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [newPerm, setNewPerm] = useState({ suffix: '', name: '', type: 'button' })

  const load = async () => {
    setLoading(true)
    try {
      const [featData, permData] = await Promise.all([
        adminFeaturesApi.get(Number(id)),
        adminFeaturesApi.listPermissions(Number(id)),
      ])
      setFeature(featData)
      setPermissions(permData.permissions ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const codePrefix = feature ? `${feature.name}` : ''

  const handleBatchCreate = async () => {
    if (!feature || selectedSuffixes.size === 0) return
    setBatching(true)
    try {
      await adminFeaturesApi.batchCreatePermissions(Number(id), {
        feature_id: Number(id),
        code_prefix: codePrefix,
        suffixes: Array.from(selectedSuffixes),
      })
      load()
    } finally {
      setBatching(false)
    }
  }

  const handleCreateCustom = async () => {
    if (!newPerm.suffix || !newPerm.name) return
    await adminFeaturesApi.createPermission(Number(id), {
      feature_id: Number(id),
      code: `${codePrefix}.${newPerm.suffix}`,
      name: newPerm.name,
      type: newPerm.type as 'menu' | 'button' | 'api',
    })
    setShowModal(false)
    setNewPerm({ suffix: '', name: '', type: 'button' })
    load()
  }

  const handleDelete = async (permId: number) => {
    if (!confirm('確定刪除此授權點？')) return
    await adminPermissionsApi.delete(permId)
    load()
  }

  if (loading) return <div className="flex justify-center py-12"><Spinner /></div>

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-semibold">
        授權點管理
        {feature && <span className="text-gray-500 font-normal text-base ml-2">— {feature.display_name}</span>}
      </h1>

      {/* Batch create from template */}
      <Card>
        <CardHeader>
          <p className="text-sm font-medium">從範本建立授權點</p>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-3 mb-3">
            {STANDARD_SUFFIXES.map((s) => (
              <Checkbox
                key={s.suffix}
                size="sm"
                isSelected={selectedSuffixes.has(s.suffix)}
                onValueChange={(v) => {
                  setSelectedSuffixes((prev) => {
                    const next = new Set(prev)
                    if (v) next.add(s.suffix)
                    else next.delete(s.suffix)
                    return next
                  })
                }}
              >
                {s.label}
              </Checkbox>
            ))}
          </div>
          <Button size="sm" color="primary" isLoading={batching} onClick={handleBatchCreate}>
            套用範本
          </Button>
        </CardBody>
      </Card>

      {/* Existing permissions */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-600">現有授權點</h2>
        <Button size="sm" startContent={<Plus size={14} />} onClick={() => setShowModal(true)}>
          新增自訂授權點
        </Button>
      </div>
      <Table aria-label="permissions" isStriped>
        <TableHeader>
          <TableColumn>Code</TableColumn>
          <TableColumn>名稱</TableColumn>
          <TableColumn>類型</TableColumn>
          <TableColumn>操作</TableColumn>
        </TableHeader>
        <TableBody items={permissions}>
          {(p) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono text-xs">{p.code}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>
                <Chip size="sm" variant="flat" color={p.type === 'menu' ? 'primary' : p.type === 'api' ? 'warning' : 'default'}>
                  {p.type}
                </Chip>
              </TableCell>
              <TableCell>
                <Button isIconOnly size="sm" variant="light" color="danger" onClick={() => handleDelete(p.id)}>
                  <Trash2 size={14} />
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Custom permission modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalContent>
          <ModalHeader>新增自訂授權點</ModalHeader>
          <ModalBody className="space-y-3">
            <Input
              label="Suffix（code後綴）"
              placeholder="e.g. reset_pwd"
              description={`完整 Code: ${codePrefix}.${newPerm.suffix || '...'}`}
              value={newPerm.suffix}
              onChange={(e) => setNewPerm({ ...newPerm, suffix: e.target.value })}
            />
            <Input
              label="顯示名稱"
              placeholder="重設密碼"
              value={newPerm.name}
              onChange={(e) => setNewPerm({ ...newPerm, name: e.target.value })}
            />
            <Select
              label="類型"
              selectedKeys={[newPerm.type]}
              onSelectionChange={(v) => setNewPerm({ ...newPerm, type: String([...v][0]) })}
            >
              <SelectItem key="menu">menu（頁面存取）</SelectItem>
              <SelectItem key="button">button（操作按鈕）</SelectItem>
              <SelectItem key="api">api（API 端點）</SelectItem>
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={() => setShowModal(false)}>取消</Button>
            <Button color="primary" onClick={handleCreateCustom}>建立</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
