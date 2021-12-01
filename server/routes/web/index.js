const { populate } = require('../../models/AdminUser')

// 此处文件是前端web的接口路由
module.exports = app => {
    const router = require('express').Router()

    // 引入模型的第一种方式，mongoose
    const mongoose = require('mongoose')
    const Article = mongoose.model("Article")
    const Category = mongoose.model("Category")
    const Hero = mongoose.model("Hero")
    // 引入模型的第二种方式：相对路径
    // const News = require("../../models/Article")
    // 测试时，直接通过js的方式将所有的数据录入到数据库中，而不是在后台自己添加
    // !导入新闻数据
    router.get('/news/init', async(req, res) => {
        const parent = await Category.findOne({
            name: '新闻分类'
        });
        // 将mongoose查询的结果进行转换，使其转换成一个Object对象，不带任何mongoose的其它东西
        // where：只找新闻分类下面的子分类
        const categories = await Category.find().where({
            parent: parent
        }).lean();
        const newsTitle = ['嫦娥源·梦皮肤语音台词票选结果公布', '新英雄金蝉斗鱼独家攻略', '孙尚香-异界灵契上线！九大国服高手孙尚香轮战口袋', '狄某有话说 | 人形“防御塔”姜子牙，只防下了队友的胜利', '孙尚香异界灵契新皮肤上线，快手三大主题活动精彩不断！', '11月16日体验服停机更新延期公告', '11月16日体验服停机更新公告', '11月16日全服不停机更新公告', '11月16日英雄平衡性调整丨诸葛亮、镜、曹操优化、澜降温', '11月13日体验服停机更新公告', '【和金蝉一起“套圈圈”】活动开启公告', '新英雄金蝉上线，两大战令返场开启', '【异界好礼 抽胡桃夹子】活动开启公告', '【微信用户专属】微信小程序“游戏礼品站”购买“孙尚香-异界灵契”皮肤抽免单活动', '双生灵契跨世重逢，缤纷好礼温暖今冬', 'KPL预报丨死神XYG来敲门，酷偕挑战Fly能否取胜？', 'KPL预报丨XYG挑战最强战力武汉eStar，能否取胜？', 'KPL预报丨广州TTG再战重庆狼队，谁家双边更宝贝？', '大区联赛小组赛直播今日开启，快来看直播打call赢好礼', '2021年KPL秋季赛常规赛第三轮赛程'];
        const newsList = newsTitle.map(title => {
            // 生成热门中的事项。其是从其它模块中抽取出来的
            // 使用slice(0)来不影响原始的数组，因为其切割数组会返回一个新的数组
            // 因为Math.random() 返回的随机是在0-1，所以减去之后根据其正负号来返回
            const randomCats = categories.slice(0).sort((a, b) => Math.random() - 0.5);
            return {
                categories: randomCats.slice(0, 2),
                title: title
            }
        });

        // 将数据库清空，表示的是以任意的条件去查询，去清空
        await Article.deleteMany({});
        await Article.insertMany(newsList);
        res.send(newsList);
    });

    // !新闻列表接口
    router.get('/news/list', async(req, res) => {
        // 先找出顶级的分类，这样做存在一个问题：如果插入的数据不够或者不够均匀，那么就会出错，所以不推荐这种方式查找数据
        // const parent = await Category.findOne({
        //     name: '新闻分类'
        // }).populate({
        //     path: 'children',
        //     populate: {
        //         path: 'newsList'
        //     }
        // }).lean();
        // 使用关联将其找出其子分类

        const parent = await Category.findOne({
            name: '新闻分类'
        });

        // mongoose.db中的聚合查询
        // 使用类似于mysql中关联的方式，能同时执行好几次查询，最终得到想要的结果
        // 每一个参数就是一个聚合管道，都是一个对象，可以定义多种聚合方式，每种不同的操作都有不同的名称：$match
        // $lookup：做外链接
        // $addFields：对查询到的数据进行一定的操作
        // $slice：对数据进行切割
        // $newsList：对查询到的数据新起的名字
        // $in：插入操作符，后面是插入的类型
        const cats = await Category.aggregate([
            {$match: {parent: parent._id}},
            {
                $lookup: {
                    from: 'articles',
                    localField: '_id',
                    foreignField: 'categories',
                    as: 'newsList'
                }
            },
            {
                $addFields: {
                    newsList: {
                        $slice: ['$newsList', 5]
                    }
                }
            }
        ])

        const subCats = cats.map(v => v._id);
        cats.unshift({
            name: '热门',
            newsList: await Article.find().where({
                categories: {$in: subCats}
            }).populate('categories').limit(5).lean()
        });
        
        cats.map(cat => {
            cat.newsList.map(news => {
                news.categoryName = cat.name === '热门' ? news.categories[0].name : cat.name;
                return news
            })
            return cat
        })
        res.send(cats);
    })

    // !导入英雄数据
    router.get("/heroes/init", async(req, res) => {
        // 清空英雄，以免导入错误，传递一个空对象表示全部删掉
        await Hero.deleteMany({});

        const rowData = [{"name":"热门","heroes":[{"name":"鲁班七号","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg"},{"name":"妲己","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg"},{"name":"安琪拉","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/142/142.jpg"},{"name":"亚瑟","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg"},{"name":"瑶","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/505/505.jpg"},{"name":"孙悟空","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg"},{"name":"孙尚香","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111.jpg"},{"name":"马可波罗","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/132/132.jpg"},{"name":"甄姬","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/127/127.jpg"},{"name":"吕布","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg"}]},{"name":"战士","heroes":[{"name":"赵云","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/107/107.jpg"},{"name":"墨子","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/108/108.jpg"},{"name":"钟无艳","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/117/117.jpg"},{"name":"吕布","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg"},{"name":"夏侯惇","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/126/126.jpg"},{"name":"曹操","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/128/128.jpg"},{"name":"典韦","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/129/129.jpg"},{"name":"宫本武藏","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/130/130.jpg"},{"name":"达摩","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/134/134.jpg"},{"name":"老夫子","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/139/139.jpg"},{"name":"关羽","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/140/140.jpg"},{"name":"程咬金","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144.jpg"},{"name":"露娜","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/146/146.jpg"},{"name":"花木兰","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/154/154.jpg"},{"name":"橘右京","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/163/163.jpg"},{"name":"亚瑟","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg"},{"name":"孙悟空","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg"},{"name":"刘备","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/170/170.jpg"},{"name":"杨戬","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/178/178.jpg"},{"name":"雅典娜","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/183/183.jpg"},{"name":"哪吒","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/180/180.jpg"},{"name":"铠","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg"},{"name":"苏烈","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/194/194.jpg"},{"name":"梦奇","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/198/198.jpg"},{"name":"裴擒虎","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/502/502.jpg"},{"name":"狂铁","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/503/503.jpg"},{"name":"孙策","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/510/510.jpg"},{"name":"李信","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/507/507.jpg"},{"name":"盘古","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/529/529.jpg"},{"name":"云中君","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/506/506.jpg"},{"name":"曜","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/522/522.jpg"},{"name":"马超","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/518/518.jpg"},{"name":"蒙恬","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/527/527.jpg"},{"name":"夏洛特","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/536/536.jpg"},{"name":"司空震","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/537/537.jpg"},{"name":"云缨","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/538/538.jpg"}]},{"name":"法师","heroes":[{"name":"小乔","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/106/106.jpg"},{"name":"墨子","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/108/108.jpg"},{"name":"妲己","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg"},{"name":"嬴政","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/110/110.jpg"},{"name":"高渐离","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/115/115.jpg"},{"name":"孙膑","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/118/118.jpg"},{"name":"扁鹊","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/119/119.jpg"},{"name":"芈月","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg"},{"name":"周瑜","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/124/124.jpg"},{"name":"甄姬","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/127/127.jpg"},{"name":"武则天","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/136/136.jpg"},{"name":"貂蝉","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg"},{"name":"安琪拉","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/142/142.jpg"},{"name":"露娜","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/146/146.jpg"},{"name":"姜子牙","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/148/148.jpg"},{"name":"王昭君","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/152/152.jpg"},{"name":"张良","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/156/156.jpg"},{"name":"不知火舞","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/157/157.jpg"},{"name":"钟馗","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/175/175.jpg"},{"name":"诸葛亮","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/190/190.jpg"},{"name":"干将莫邪","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/182/182.jpg"},{"name":"女娲","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/179/179.jpg"},{"name":"杨玉环","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/176/176.jpg"},{"name":"弈星","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/197/197.jpg"},{"name":"米莱狄","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/504/504.jpg"},{"name":"司马懿","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/137/137.jpg"},{"name":"沈梦溪","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/312/312.jpg"},{"name":"上官婉儿","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/513/513.jpg"},{"name":"嫦娥","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/515/515.jpg"},{"name":"西施","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/523/523.jpg"},{"name":"司空震","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/537/537.jpg"},{"name":"金蝉","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/540/540.jpg"}]},{"name":"坦克","heroes":[{"name":"廉颇","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/105/105.jpg"},{"name":"庄周","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg"},{"name":"刘禅","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/114/114.jpg"},{"name":"钟无艳","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/117/117.jpg"},{"name":"白起","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/120/120.jpg"},{"name":"芈月","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg"},{"name":"吕布","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg"},{"name":"夏侯惇","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/126/126.jpg"},{"name":"达摩","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/134/134.jpg"},{"name":"项羽","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/135/135.jpg"},{"name":"程咬金","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144.jpg"},{"name":"刘邦","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/149/149.jpg"},{"name":"亚瑟","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg"},{"name":"牛魔","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/168/168.jpg"},{"name":"张飞","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/171/171.jpg"},{"name":"太乙真人","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg"},{"name":"东皇太一","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/187/187.jpg"},{"name":"铠","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg"},{"name":"苏烈","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/194/194.jpg"},{"name":"梦奇","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/198/198.jpg"},{"name":"孙策","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/510/510.jpg"},{"name":"盾山","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/509/509.jpg"},{"name":"嫦娥","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/515/515.jpg"},{"name":"猪八戒","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/511/511.jpg"},{"name":"蒙恬","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/527/527.jpg"},{"name":"阿古朵","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/533/533.jpg"}]},{"name":"刺客","heroes":[{"name":"赵云","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/107/107.jpg"},{"name":"阿轲","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/116/116.jpg"},{"name":"李白","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/131/131.jpg"},{"name":"貂蝉","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg"},{"name":"韩信","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150.jpg"},{"name":"兰陵王","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/153/153.jpg"},{"name":"花木兰","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/154/154.jpg"},{"name":"不知火舞","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/157/157.jpg"},{"name":"娜可露露","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/162/162.jpg"},{"name":"橘右京","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/163/163.jpg"},{"name":"孙悟空","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg"},{"name":"百里守约","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/196/196.jpg"},{"name":"百里玄策","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/195/195.jpg"},{"name":"裴擒虎","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/502/502.jpg"},{"name":"元歌","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/125/125.jpg"},{"name":"司马懿","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/137/137.jpg"},{"name":"上官婉儿","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/513/513.jpg"},{"name":"云中君","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/506/506.jpg"},{"name":"马超","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/518/518.jpg"},{"name":"镜","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/531/531.jpg"},{"name":"澜","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/528/528.jpg"},{"name":"云缨","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/538/538.jpg"}]},{"name":"射手","heroes":[{"name":"孙尚香","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111.jpg"},{"name":"鲁班七号","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg"},{"name":"马可波罗","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/132/132.jpg"},{"name":"狄仁杰","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/133/133.jpg"},{"name":"后羿","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169.jpg"},{"name":"李元芳","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/173/173.jpg"},{"name":"虞姬","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/174/174.jpg"},{"name":"成吉思汗","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/177/177.jpg"},{"name":"黄忠","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/192/192.jpg"},{"name":"百里守约","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/196/196.jpg"},{"name":"公孙离","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/199/199.jpg"},{"name":"伽罗","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/508/508.jpg"},{"name":"蒙犽","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/524/524.jpg"},{"name":"艾琳","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/155/155.jpg"}]},{"name":"辅助","heroes":[{"name":"庄周","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg"},{"name":"刘禅","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/114/114.jpg"},{"name":"孙膑","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/118/118.jpg"},{"name":"牛魔","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/168/168.jpg"},{"name":"张飞","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/171/171.jpg"},{"name":"钟馗","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/175/175.jpg"},{"name":"蔡文姬","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/184/184.jpg"},{"name":"太乙真人","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg"},{"name":"大乔","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/191/191.jpg"},{"name":"东皇太一","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/187/187.jpg"},{"name":"鬼谷子","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/189/189.jpg"},{"name":"明世隐","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/501/501.jpg"},{"name":"盾山","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/509/509.jpg"},{"name":"瑶","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/505/505.jpg"},{"name":"鲁班大师","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/525/525.jpg"},{"name":"阿古朵","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/533/533.jpg"},{"name":"金蝉","icon":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/540/540.jpg"}]}];

        for (let cat of rowData) {
            if (cat.name === "热门") continue;

            // 从后台数据库中找到当前分类对应的数据
            const category = await Category.findOne({
                name: cat.name
            });
            cat.heroes = cat.heroes.map(hero => {
                // 原先应该是传入其_id，但是如果传入的是一个对象，会自动将id值提取出来放入
                hero.categories = [category];
                return hero;
            });

            // 录入英雄
            await Hero.insertMany(cat.heroes);
        } 

        res.send(await Hero.find());
    });

    // !英雄列表接口
    router.get("/heroes/list", async (req, res) => {
        // 在分类列表中的名字
        const parent = await Category.findOne({
            name: '英雄分类'
        });

        // 这个非常的强大，推荐系统学习一波
        // 第一个聚合管道：$match来进行条件查询，多个查询聚合在一起，相当于查询一次
        // 第二个聚合管道：关联查询，并赋值给一个新的字段：heroList
        // 此处不需要和新闻一般限制操作
        const cats = await Category.aggregate([
            { $match: { parent: parent._id }},
            {
                $lookup: {
                    from: 'heroes',
                    localField: '_id',
                    foreignField: 'categories',
                    as: 'heroList'
                }
            }
        ]);

        // 上面使用关联查询，那么就需要在对应的Category模块中添加相应的子分类查询
    
        const subCats = cats.map(v => v._id);
        cats.unshift({
            name: '热门',
            heroList: await Hero.find().where({
                categories: { $in: subCats }
            }).populate('categories').limit(10).lean()
        });
        
        cats.map(cat => {
            cat.heroList.map(hero => {
                hero.categoryName = cat.name === '热门' ? hero.categories[0].name : cat.name;
                return hero
            })
            return cat;
        })
        res.send(cats);
    });


    // 文章详情
    router.get("/articles/:id", async (req, res) => {
        const data = await Article.findById(req.params.id).lean();
        res.send(data);
    });

    // 英雄详情
    router.get("/heroes/:id", async (req, res) => {
        // 对分类进行关联调用
        const data = await Hero
            .findById(req.params.id)
            .populate('categories items1 items2 partners.hero counters.hero gankers.hero')
            .lean();
        res.send(data);
    });

    app.use('/web/api', router)
}