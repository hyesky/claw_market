import { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, Save } from 'lucide-react';
import { productsApi } from '../services/api';

export default function UploadPage() {
  const [files, setFiles] = useState<{ name: string; content: string; size: number }[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    agent_type: 'assistant',
    model_compatibility: [] as string[],
    price: '',
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const agentTypes = [
    { value: 'assistant', label: '助手' },
    { value: 'companion', label: '陪伴' },
    { value: 'tutor', label: '导师' },
    { value: 'creative', label: '创意' },
    { value: 'professional', label: '专业' },
  ];

  const models = ['GPT-4', 'Claude', 'Gemini', 'Llama 3', 'Qwen'];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.name.match(/.(md|json)$/i) && file.name.match(/SOUL|AGENTS|USER/i)
    );

    droppedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFiles((prev) => [
          ...prev.filter((f) => f.name !== file.name),
          { name: file.name, content, size: file.size },
        ]);
      };
      reader.readAsText(file);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(
      (file) => file.name.match(/.(md|json)$/i) && file.name.match(/SOUL|AGENTS|USER/i)
    );

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFiles((prev) => [
          ...prev.filter((f) => f.name !== file.name),
          { name: file.name, content, size: file.size },
        ]);
      };
      reader.readAsText(file);
    });
  };

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  const generateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async () => {
    if (!files.some((f) => f.name.match(/SOUL/i))) {
      alert('请至少上传 SOUL.md 文件');
      return;
    }

    setIsSubmitting(true);
    try {
      const soulFile = files.find((f) => f.name.match(/SOUL/i));
      await productsApi.create({
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        agent_type: formData.agent_type,
        model_compatibility: formData.model_compatibility,
        price: Number(formData.price),
        file_content: soulFile?.content || '',
      });

      alert('上传成功！');
      // Redirect to products page
      window.location.href = '/products';
    } catch (error) {
      console.error('Upload error:', error);
      alert('上传失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requiredFields = ['title', 'slug', 'description', 'price'];
  const isValid =
    requiredFields.every((field) => formData[field as keyof typeof formData]) &&
    files.some((f) => f.name.match(/SOUL/i));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">上传人格配置</h1>
      <p className="text-gray-600 mb-8">分享你设计的 Agent 人格配置到 Claw Market</p>

      <div className="space-y-6">
        {/* File Upload */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">上传配置文件</h2>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 mb-2">拖拽文件到此处，或点击选择文件</p>
            <p className="text-sm text-gray-500">
              支持文件：SOUL.md, AGENTS.md, USER.md (最大 50MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".md,.json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              选择文件
            </button>
          </div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="text-sm font-medium text-gray-700">已上传文件</h3>
              {files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(file.name)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Validation Warning */}
          {!files.some((f) => f.name.match(/SOUL/i)) && (
            <div className="mt-4 flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">请至少上传一个 SOUL.md 文件</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">商品信息</h2>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商品标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="例如：贴心助理小助手"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商品链接 <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="caring-assistant"
                />
                <button
                  onClick={generateSlug}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  自动生成
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                只能包含小写字母、数字和连字符 (例如：my-soul-config)
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商品描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
                placeholder="描述你的人格配置，包括用途、特色、适用场景等..."
              />
            </div>

            {/* Agent Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent 类型
              </label>
              <select
                value={formData.agent_type}
                onChange={(e) => setFormData((prev) => ({ ...prev, agent_type: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {agentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Compatibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                模型兼容性
              </label>
              <div className="flex flex-wrap gap-2">
                {models.map((model) => (
                  <label
                    key={model}
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                  >
                    <input
                      type="checkbox"
                      checked={formData.model_compatibility.includes(model)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            model_compatibility: [...prev.model_compatibility, model],
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            model_compatibility: prev.model_compatibility.filter((m) => m !== model),
                          }));
                        }
                      }}
                      className="w-4 h-4 text-primary-600"
                    />
                    <span className="text-sm text-gray-700">{model}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                价格 (CNY) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="29.90"
                  min="0"
                  step="0.01"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                平台将收取 5% 的服务费，剩余金额归您所有
              </p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-100 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">商品预览</h2>
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900">{formData.title || '商品标题'}</h3>
            <p className="text-sm text-gray-600 mt-1">{formData.description || '商品描述'}...</p>
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {agentTypes.find((t) => t.value === formData.agent_type)?.label}
              </span>
              <span className="text-xs text-gray-500">
                {formData.model_compatibility.length} 个模型兼容
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            onClick={() => {
              setFormData({
                title: '',
                slug: '',
                description: '',
                agent_type: 'assistant',
                model_compatibility: [],
                price: '',
              });
              setFiles([]);
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            重置
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>{isSubmitting ? '上传中...' : '提交审核'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
