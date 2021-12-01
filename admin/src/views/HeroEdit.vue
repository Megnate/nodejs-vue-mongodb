<template>
  <div class="about">
    <h1>{{ id ? "编辑" : "新建" }}英雄</h1>
    <el-form label-width="120px" @submit.prevent="save">
      <!-- value表示默认显示的pane，对应其中的name，类型也可以换 -->
      <el-tabs type="border-card">
        <el-tab-pane label="基本信息">
          <el-form-item label="名称">
            <el-input v-model="model.name"></el-input>
          </el-form-item>
          <el-form-item label="称号">
            <el-input v-model="model.title"></el-input>
          </el-form-item>
          <el-form-item label="英雄图标">
            <!-- :before-upload="beforeAvatarUpload"是上传之前做的验证 -->
            <el-upload
              class="avatar-uploader"
              :action="uploadURLMixin"
              :headers="getAuthHeadersMixin()"
              :show-file-list="false"
              :on-success="afterUpload"
            >
              <img v-if="model.icon" :src="model.icon" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="英雄背景图">
            <!-- :before-upload="beforeAvatarUpload"是上传之前做的验证 -->
            <el-upload
              class="avatar-uploader"
              :action="uploadURLMixin"
              :headers="getAuthHeadersMixin()"
              :show-file-list="false"
              :on-success="(res) => (model.banner = res.url)"
            >
              <img v-if="model.banner" :src="model.banner" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="model.categories" multiple>
              <el-option
                v-for="item of categories"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="难度">
            <!-- el-rate是一个打分的样式，不需要进行手动的输入，可以有默认的分值也可以没有 -->
            <el-rate
              style="margin-top: 0.6rem"
              :max="9"
              show-score
              v-model="model.scores.difficult"
            ></el-rate>
          </el-form-item>
          <el-form-item label="技能">
            <!-- el-rate是一个打分的样式，不需要进行手动的输入，可以有默认的分值也可以没有 -->
            <el-rate
              style="margin-top: 0.6rem"
              :max="9"
              show-score
              v-model="model.scores.skills"
            ></el-rate>
          </el-form-item>
          <el-form-item label="对抗">
            <!-- el-rate是一个打分的样式，不需要进行手动的输入，可以有默认的分值也可以没有 -->
            <el-rate
              style="margin-top: 0.6rem"
              :max="9"
              show-score
              v-model="model.scores.attack"
            ></el-rate>
          </el-form-item>
          <el-form-item label="生存">
            <!-- el-rate是一个打分的样式，不需要进行手动的输入，可以有默认的分值也可以没有 -->
            <el-rate
              style="margin-top: 0.6rem"
              :max="9"
              show-score
              v-model="model.scores.service"
            ></el-rate>
          </el-form-item>
          <el-form-item label="顺风出装">
            <el-select v-model="model.items1" multiple>
              <el-option
                v-for="item of items1"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="逆风出装">
            <el-select v-model="model.items2" multiple>
              <el-option
                v-for="item of items2"
                :key="item._id"
                :label="item.name"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用技巧">
            <el-input v-model="model.usage_tips"></el-input>
          </el-form-item>
          <el-form-item label="对抗技巧">
            <el-input v-model="model.battle_tips"></el-input>
          </el-form-item>
          <el-form-item label="团战思路">
            <el-input v-model="model.team_tips"></el-input>
          </el-form-item>
        </el-tab-pane>
        <!-- 添加英雄技能 -->
        <el-tab-pane label="技能">
          <el-button type="text" @click="model.skills.push({})">
            <i class="el-icon-plus"></i>添加技能
          </el-button>
          <!-- 表明这个每一行都符合flex布局，进行换行 -->
          <el-row type="flex" style="flex-wrap: wrap">
            <!-- md设置宽度，且要进行循环 -->
            <el-col
              :span="12"
              v-for="(skill, index) in model.skills"
              :key="index"
            >
              <el-form-item label="名称">
                <el-input v-model="skill.name"></el-input>
              </el-form-item>
              <el-form-item label="图标">
                <!-- :before-upload="beforeAvatarUpload"是上传之前做的验证 -->
                <el-upload
                  class="avatar-uploader"
                  :action="uploadURLMixin"
                  :headers="getAuthHeadersMixin()"
                  :show-file-list="false"
                  :on-success="(res) => (skill.icon = res.url)"
                >
                  <img v-if="skill.icon" :src="skill.icon" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="描述">
                <el-input
                  type="textarea"
                  v-model="skill.description"
                ></el-input>
              </el-form-item>
              <el-form-item label="小技巧">
                <el-input type="textarea" v-model="skill.tips"></el-input>
              </el-form-item>
              <el-form-item label="冷却值">
                <el-input type="textarea" v-model="skill.coolDown"></el-input>
              </el-form-item>
              <el-form-item label="消耗">
                <el-input type="textarea" v-model="skill.cost"></el-input>
              </el-form-item>
              <el-form-item>
                <!-- 通过对skills数组的切片实现删除 -->
                <el-button
                  type="danger"
                  size="small"
                  @click="model.skills.splice(index, 1)"
                  >删除</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- 添加最佳搭档 -->
        <el-tab-pane label="最佳搭档">
          <el-button type="text" @click="model.partners.push({})">
            <i class="el-icon-plus"></i>添加最佳搭档
          </el-button>
          <!-- 表明这个每一行都符合flex布局，进行换行 -->
          <el-row type="flex" style="flex-wrap: wrap">
            <!-- md设置宽度，且要进行循环 -->
            <el-col
              :span="12"
              v-for="(partner, index) in model.partners"
              :key="index"
            >
              <el-form-item label="英雄">
                <el-select filterable v-model="partner.hero">
                  <el-option
                    v-for="(hero, i) in heroes"
                    :key="i"
                    :value="hero._id"
                    :label="hero.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述">
                <el-input
                  type="textarea"
                  v-model="partner.description"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <!-- 通过对数组的切片实现删除 -->
                <el-button
                  type="danger"
                  size="small"
                  @click="model.partners.splice(index, 1)"
                  >删除</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- 添加被谁克制 -->
        <el-tab-pane label="被谁克制">
          <el-button type="text" @click="model.counters.push({})">
            <i class="el-icon-plus"></i>添加被谁克制
          </el-button>
          <!-- 表明这个每一行都符合flex布局，进行换行 -->
          <el-row type="flex" style="flex-wrap: wrap">
            <!-- md设置宽度，且要进行循环 -->
            <el-col
              :span="12"
              v-for="(counter, index) in model.counters"
              :key="index"
            >
              <el-form-item label="英雄">
                <el-select filterable v-model="counter.hero">
                  <el-option
                    v-for="(hero, i) in heroes"
                    :key="i"
                    :value="hero._id"
                    :label="hero.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述">
                <el-input
                  type="textarea"
                  v-model="counter.description"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <!-- 通过对数组的切片实现删除 -->
                <el-button
                  type="danger"
                  size="small"
                  @click="model.counters.splice(index, 1)"
                  >删除</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!-- 添加克制谁 -->
        <el-tab-pane label="克制谁">
          <el-button type="text" @click="model.gankers.push({})">
            <i class="el-icon-plus"></i>添加克制谁
          </el-button>
          <!-- 表明这个每一行都符合flex布局，进行换行 -->
          <el-row type="flex" style="flex-wrap: wrap">
            <!-- md设置宽度，且要进行循环 -->
            <el-col
              :span="12"
              v-for="(ganker, index) in model.gankers"
              :key="index"
            >
              <el-form-item label="英雄">
                <el-select filterable v-model="ganker.hero">
                  <el-option
                    v-for="(hero, i) in heroes"
                    :key="i"
                    :value="hero._id"
                    :label="hero.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述">
                <el-input
                  type="textarea"
                  v-model="ganker.description"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <!-- 通过对数组的切片实现删除 -->
                <el-button
                  type="danger"
                  size="small"
                  @click="model.gankers.splice(index, 1)"
                  >删除</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-form-item style="marin-top: 1rem">
        <!-- 表明原生类型为一个提交按钮 -->
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  getCurrentInstance,
  onBeforeMount,
  reactive,
} from "vue";

export default defineComponent({
  emits: ["save"],
  // 通过id来判断是处于编辑状态还是新增状态，编辑状态需要将数据填入input框
  props: {
    id: { type: String },
  },
  setup(props, context) {
    // 获取当前组件实例，不推荐使用ctx，推荐使用proxy
    const { proxy }: any = getCurrentInstance();
    const res_proxy: any = ref(proxy);
    // 这里是因为服务端不存在scores这个键值，所以需要特别的说明
    let model: any = reactive({
      scores: {
        difficult: 0,
        skills: 0,
        attack: 0,
        service: 0,
      },
    });
    const fetch = async (): Promise<void> => {
      const result = await proxy.$http.get(`/rest/heroes/${props.id}`);
      // 将服务端和客户端的属性进行合并，合并之后还需要将合并的完整的赋值给model，所以第一个参数放的是model
      model = Object.assign(model, result.data);
    };

    const categories: any = ref([]);
    const fetch_categories = async (): Promise<void> => {
      const result = await proxy.$http.get(`/rest/categories`);
      // 只需要其中的英雄分类
      categories.value = result.data;
    };

    const heroes: any = ref([]);
    const fetch_heroes = async (): Promise<void> => {
      const res = await proxy.$http.get(`/rest/heroes`);
      heroes.value = res.data;
    };

    const items1: any = ref([]);
    const items2: any = ref([]);
    const fetch_items1 = async (): Promise<void> => {
      const result = await proxy.$http.get(`/rest/items`);
      items1.value = result.data;
      items2.value = result.data;
    };

    // 需要在created阶段判断是否执行fetch
    onBeforeMount(() => {
      props.id && fetch();
      fetch_categories();
      fetch_heroes();
      fetch_items1();
    });

    return { model, res_proxy, categories, items1, items2, heroes };
  },
  methods: {
    // 服务端返回的数据
    afterUpload(res: any) {
      // 如果没有赋值上新的键值对，那么可以使用显式赋值的方式
      this.model.icon = res.url;
    },
    async save() {
      if (this.id) {
        // 存在id，所以是修改
        await this.res_proxy.$http.put(
          `rest/heroes/edit/${this.id}`,
          this.model
        );
      } else {
        // 将异步的回调函数的写法换成类似的同步的写法，因为其返回的是Promise类型的，所以没有问题
        await this.res_proxy.$http.post("/rest/heroes", this.model);
      }
      // 提交之后进行页面的跳转
      this.$router.push("/heroes/list");
      // 使用的是Element-plus中的ElMessage
      this.res_proxy.$message({
        type: "success",
        message: "保存成功",
      });
    },
  },
});
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 5rem;
  height: 5rem;
  line-height: 5rem;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 100%;
  display: block;
}
</style>