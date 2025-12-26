<template>
  <div class="admin-knowledge">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>知识库管理</h3>
          <el-button type="primary" @click="showCreateDialog = true">创建文章</el-button>
        </div>
      </template>

      <el-table :data="articles" v-loading="loading" style="width: 100%">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'">
              {{ row.status === "published" ? "已发布" : "草稿" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="categories" label="分类" width="150">
          <template #default="{ row }">
            <el-tag v-for="cat in row.categories" :key="cat" size="small" style="margin-right: 4px">
              {{ cat }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="浏览次数" width="100" />
        <el-table-column prop="authorName" label="作者" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button link @click="editArticle(row)">编辑</el-button>
            <el-button link type="danger" @click="deleteArticle(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.limit"
        :total="pagination.total"
        @current-change="loadArticles"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <!-- 创建/编辑文章对话框 -->
    <el-dialog v-model="showCreateDialog" :title="editingArticle ? '编辑文章' : '创建文章'" width="800px">
      <el-form :model="articleForm" label-width="100px">
        <el-form-item label="标题" required>
          <el-input v-model="articleForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="articleForm.summary" type="textarea" :rows="2" placeholder="请输入摘要" />
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input
            v-model="articleForm.content"
            type="textarea"
            :rows="10"
            placeholder="请输入文章内容"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="articleForm.status" placeholder="请选择状态">
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="articleForm.categories" multiple placeholder="请选择分类">
            <el-option label="FAQ" value="faq" />
            <el-option label="使用指南" value="guide" />
            <el-option label="公告" value="announcement" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select v-model="articleForm.tags" multiple filterable allow-create placeholder="请输入标签">
            <el-option label="常见问题" value="常见问题" />
            <el-option label="技术支持" value="技术支持" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="saveArticle" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  knowledgeService,
  type KnowledgeArticle,
  type CreateArticleDto
} from "../../services/knowledge.service";

const articles = ref<KnowledgeArticle[]>([]);
const loading = ref(false);
const saving = ref(false);
const showCreateDialog = ref(false);
const editingArticle = ref<KnowledgeArticle | null>(null);

const pagination = ref({
  page: 1,
  limit: 20,
  total: 0
});

const articleForm = ref<CreateArticleDto>({
  title: "",
  content: "",
  summary: "",
  status: "draft",
  categories: [],
  tags: []
});

const loadArticles = async () => {
  loading.value = true;
  try {
    const result = await knowledgeService.findAll({
      page: pagination.value.page,
      limit: pagination.value.limit
    });
    articles.value = result.articles;
    pagination.value.total = result.total;
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || "加载文章失败");
  } finally {
    loading.value = false;
  }
};

const editArticle = (article: KnowledgeArticle) => {
  editingArticle.value = article;
  articleForm.value = {
    title: article.title,
    content: article.content,
    summary: article.summary,
    status: article.status as any,
    categories: article.categories,
    tags: article.tags
  };
  showCreateDialog.value = true;
};

const saveArticle = async () => {
  if (!articleForm.value.title || !articleForm.value.content) {
    ElMessage.warning("请填写标题和内容");
    return;
  }

  saving.value = true;
  try {
    if (editingArticle.value) {
      await knowledgeService.update(editingArticle.value._id, articleForm.value);
      ElMessage.success("文章更新成功");
    } else {
      await knowledgeService.create(articleForm.value);
      ElMessage.success("文章创建成功");
    }
    showCreateDialog.value = false;
    resetForm();
    loadArticles();
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || "保存失败");
  } finally {
    saving.value = false;
  }
};

const deleteArticle = async (article: KnowledgeArticle) => {
  try {
    await ElMessageBox.confirm("确定要删除此文章吗？", "提示", { type: "warning" });
    await knowledgeService.delete(article._id);
    ElMessage.success("删除成功");
    loadArticles();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(error.response?.data?.message || "删除失败");
    }
  }
};

const resetForm = () => {
  editingArticle.value = null;
  articleForm.value = {
    title: "",
    content: "",
    summary: "",
    status: "draft",
    categories: [],
    tags: []
  };
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString("zh-CN");
};

onMounted(() => {
  loadArticles();
});
</script>

<style scoped lang="scss">
.admin-knowledge {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
    }
  }
}
</style>

